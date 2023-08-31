import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Logger } from 'nestjs-pino';
import { onlineUntilExpiration } from '../../utils/time';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: Logger,
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly users: EntityRepository<User>,
  ) {}

  async createUser(user: User): Promise<User | undefined> {
    try {
      await this.users.create(user);
      await this.em.flush();
    } catch (e) {
      this.logger.error(e);

      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException('Email already in use.');
      }

      throw e;
    }

    return user;
  }

  async getAllUsersWithUsername(username: string): Promise<User[]> {
    return this.users.find({ username }, { fields: ['discriminator'] });
  }

  async findOneByUsernameAndDiscriminator(
    username: string,
    discriminator: string,
  ): Promise<User | null> {
    return this.users.findOne({ username, discriminator });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.findOne({ _id: new ObjectId(id) });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ email });
  }

  async onlineUsers(): Promise<number> {
    return this.users.count({ onlineUntil: { $gt: Date.now() } });
  }

  async updateUserOnlineTimeById(userId: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (!user) return;

    user.onlineUntil = onlineUntilExpiration();
  }
}
