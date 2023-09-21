import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { sample } from 'lodash';

import { IFullUser, IHasAccessToken } from '@interfaces';
import { AggregatorService } from '@modules/aggregator/aggregator.service';
import { ContentService } from '@modules/content/content.service';
import { Logger } from 'nestjs-pino';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private readonly aggregatorService: AggregatorService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly contentService: ContentService,
  ) {}

  async signUp(
    username: string,
    password: string,
    email: string,
  ): Promise<IFullUser | { error: string }> {
    if (this.contentService.censor.isProfaneIsh(username))
      return { error: 'Username is somewhat profane. Please choose again.' };

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

    const hash = await bcrypt.hash(password, 10);
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'Unable to sign in.' };
    }

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
}
