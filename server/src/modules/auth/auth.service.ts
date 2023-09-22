import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { random, sample } from 'lodash';

import { IFullUser, IHasAccessToken, UserResponse } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AggregatorService } from '@modules/aggregator/aggregator.service';
import { UserVerification } from '@modules/auth/verification.schema';
import { ContentService } from '@modules/content/content.service';
import { EmailService } from '@modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { userErrorObject, userSuccessObject } from '@utils/usernotifications';
import { generateUUID } from '@utils/uuid';
import { Logger } from 'nestjs-pino';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly logger: Logger,
    private readonly aggregatorService: AggregatorService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly contentService: ContentService,
    private readonly emailService: EmailService,
    @InjectRepository(UserVerification)
    private readonly verifications: EntityRepository<UserVerification>,
  ) {}

  private isValidUsername(username: string): boolean {
    return username.length >= 2 && username.length <= 20;
  }

  private isValidEmail(email: string): boolean {
    return /\S+@\S+\.\S+/.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async signUp(
    username: string,
    password: string,
    email: string,
  ): Promise<IFullUser | { error: string }> {
    if (this.contentService.censor.isProfaneIsh(username))
      return { error: 'Username is somewhat profane. Please choose again.' };

    if (!this.isValidUsername(username)) return { error: 'Invalid username.' };
    if (!this.isValidPassword(password)) return { error: 'Invalid password.' };
    if (!this.isValidEmail(email)) return { error: 'Invalid email.' };

    const usersWithUsername = await this.userService.getAllUsersWithUsername(
      username,
    );
    let availableDiscriminators = Array.from({ length: 9999 }, (_, i) =>
      (i + 1).toString().padStart(4, '0'),
    );

    if (usersWithUsername.length > 9998) {
      return { error: `Username ${username} is not available.` };
    } else if (usersWithUsername.length >= 1) {
      const usedDiscriminators = new Set(
        usersWithUsername.map((user) => user.discriminator),
      );
      availableDiscriminators = availableDiscriminators.filter(
        (discriminator) => !usedDiscriminators.has(discriminator),
      );
    }

    const discriminator = sample(availableDiscriminators);
    if (!discriminator) return { error: 'Failed to create user.' };

    const hash = await this.hashPassword(password);
    const newUser = new User(username, discriminator, hash, email);
    let createdUser;

    try {
      createdUser = await this.userService.createUser(newUser);
    } catch (err) {
      return {
        error: 'Failed to create user. This email might already be in use.',
      };
    }

    if (!createdUser) return { error: 'Failed to create user.' };

    this.logger.verbose(
      `Registered new user: ${createdUser.username}#${createdUser.discriminator}`,
    );

    return this.aggregatorService.getAllUserInformation(
      createdUser._id.toString(),
    );
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<IFullUser | IHasAccessToken | { error: string }> {
    const user = await this.userService.findUserByEmail(username);
    if (!user) {
      return { error: 'Unable to sign in.' };
    }

    const isRealMatch = await bcrypt.compare(password, user.password);
    const isTemporaryMatch = user.temporaryPassword === password;
    if (!isRealMatch && !isTemporaryMatch) {
      return { error: 'Unable to sign in.' };
    }

    user.temporaryPassword = '';
    await this.userService.updateUserOnlineTimeById(user._id.toString());

    const jwtPayload = {
      sub: user._id,
      username: user.username,
      discriminator: user.discriminator,
    };

    return {
      ...(await this.aggregatorService.getAllUserInformation(
        user._id.toString(),
      )),
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }

  async newJwt(token: string): Promise<IHasAccessToken> {
    const jwtPayload = await this.decodeJwt(token);
    delete jwtPayload.iat;
    delete jwtPayload.exp;

    return {
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }

  async decodeJwt(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }

  async requestTemporaryPassword(email: string): Promise<UserResponse> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return {
        actions: [userErrorObject('No email matches that id.')],
      };
    }

    const code = generateUUID().split('-').join('');

    user.temporaryPassword = code;

    await this.emailService.sendTemporaryPasswordEmail(user);

    return {
      actions: [
        userSuccessObject(
          'Your temporary password has been sent. Please check your email shortly!',
        ),
      ],
    };
  }

  async requestVerificationForUser(userId: string): Promise<UserResponse> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      return {
        actions: [userErrorObject('No email matches that id.')],
      };
    }

    const existingVerification = await this.verifications.findOne({
      email: user.email,
    });
    if (existingVerification) {
      await this.verifications.removeAndFlush(existingVerification);
    }

    const hours = +this.configService.get<number>(
      'SMTP_AUTH_VERIFY_HOUR_LIMIT',
      1,
    );

    const code = `${random(100000, 999999)}`;

    const verification = new UserVerification(user.email, code, hours);
    await this.verifications.create(verification);
    await this.em.flush();

    await this.emailService.sendVerificationCodeEmail(
      user,
      verification,
      hours,
    );

    return {
      actions: [
        userSuccessObject(
          'Your verification code has been sent. Please check your email shortly!',
        ),
      ],
    };
  }

  public async validateVerificationCodeForUser(
    userId: string,
    code: string,
  ): Promise<UserResponse> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      return {
        actions: [userErrorObject('No user matches that id.')],
      };
    }

    if (user.emailVerified) {
      return {
        actions: [userErrorObject('Your email has already been verified!')],
      };
    }

    const existingVerification = await this.verifications.findOne({
      email: user.email,
    });

    const checkCode = code.trim();

    if (!existingVerification) {
      return {
        actions: [
          userErrorObject('No verification code exists for that email.'),
        ],
      };
    }

    if (checkCode !== existingVerification.verificationCode) {
      return {
        actions: [userErrorObject('Incorrect verification code.')],
      };
    }

    const userPatches = await getPatchesAfterPropChanges(user, async (user) => {
      user.emailVerified = true;
    });

    await this.verifications.removeAndFlush(existingVerification);

    return {
      user: userPatches,
      actions: [userSuccessObject('Your email has been verified!')],
    };
  }

  public async changeEmail(
    userId: string,
    newEmail: string,
  ): Promise<UserResponse> {
    if (!this.isValidEmail(newEmail)) {
      return {
        actions: [userErrorObject('Invalid email address.')],
      };
    }
    const user = await this.userService.findUserById(userId);
    if (!user) {
      return {
        actions: [userErrorObject('No user matches that id.')],
      };
    }

    const userPatches = await getPatchesAfterPropChanges(user, async (user) => {
      user.emailVerified = false;
      user.email = newEmail;
    });

    return {
      user: userPatches,
      actions: [
        userSuccessObject(
          'Your email has been changed. You will need to re-verify it.',
        ),
      ],
    };
  }

  public async changePassword(
    userId: string,
    newPassword: string,
  ): Promise<UserResponse> {
    if (!this.isValidPassword(newPassword)) {
      return {
        actions: [userErrorObject('Invalid password.')],
      };
    }
    const user = await this.userService.findUserById(userId);
    if (!user) {
      return {
        actions: [userErrorObject('No user matches that id.')],
      };
    }

    const userPatches = await getPatchesAfterPropChanges(user, async (user) => {
      user.password = await this.hashPassword(newPassword);
    });

    return {
      user: userPatches,
      actions: [
        userSuccessObject(
          'Your password has been changed. Please log out and log back in.',
        ),
      ],
    };
  }
}
