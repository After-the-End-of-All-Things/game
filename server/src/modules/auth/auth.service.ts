import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { random } from 'lodash';

import { IFullUser, IHasAccessToken } from '@interfaces';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    username: string,
    password: string,
    email: string,
  ): Promise<IFullUser> {
    const usersWithUsername = await this.userService.getAllUsersWithUsername(
      username,
    );
    const usedDiscriminators = usersWithUsername.map(
      (user) => user.discriminator,
    );
    let discriminator;

    do {
      discriminator = random(1, 9999).toString().padStart(4, '0');
    } while (usedDiscriminators.includes(discriminator));

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User(username, discriminator, hash, email);
    const createdUser = await this.userService.createUser(newUser);

    return this.userService.getAllUserInformation(createdUser._id.toString());
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<IFullUser | IHasAccessToken> {
    const user = await this.userService.findUserByEmail(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    await this.userService.updateUserOnlineTimeById(user._id.toString());

    const jwtPayload = {
      sub: user._id,
      username: user.username,
      discriminator: user.discriminator,
    };

    return {
      ...(await this.userService.getAllUserInformation(user._id.toString())),
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
