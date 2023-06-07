import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { random } from 'lodash';

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
  ): Promise<any> {
    const numberOfUsers = await this.userService.numberOfUsersWithUsername(
      username,
    );

    if (numberOfUsers > 9000) {
      throw new BadRequestException(
        'Username has been taken at least 9000 times, it is no longer usable.',
      );
    }

    let discriminator;

    do {
      discriminator = random(1, 9999).toString().padStart(4, '0');
      const existingUser =
        await this.userService.findOneByUsernameAndDiscriminator(
          username,
          discriminator,
        );
      if (!existingUser) break;
    } while (true);

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User(username, discriminator, hash, email);
    await this.userService.createUser(newUser);

    return { user: newUser };
  }

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    this.userService.updateUserOnlineTimeById(user._id.toString());

    const jwtPayload = {
      sub: user._id,
      username: user.username,
      discriminator: user.discriminator,
    };

    return {
      user,
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }

  async newJwt(token: string): Promise<any> {
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
