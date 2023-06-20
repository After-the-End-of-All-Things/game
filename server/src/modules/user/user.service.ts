import { IFullUser } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AchievementsService } from '@modules/achievements/achievements.service';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { InventoryService } from '@modules/inventory/inventory.service';
import { PlayerService } from '@modules/player/player.service';
import { StatsService } from '@modules/stats/stats.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { onlineUntilExpiration } from '../../utils/time';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly users: EntityRepository<User>,
    private readonly playerService: PlayerService,
    private readonly statsService: StatsService,
    private readonly discoveriesService: DiscoveriesService,
    private readonly achievementsService: AchievementsService,
    private readonly inventoryService: InventoryService,
  ) {}

  async createUser(user: User): Promise<User | undefined> {
    try {
      await this.users.create(user);
      await this.em.flush();
    } catch (e) {
      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException('Email already in use.');
      }
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

  async getAllUserInformation(userId: string): Promise<IFullUser> {
    const user = await this.findUserById(userId);
    const player = await this.playerService.getPlayerForUser(userId);
    const stats = await this.statsService.getStatsForUser(userId);
    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );
    const achievements = await this.achievementsService.getAchievementsForUser(
      userId,
    );
    const inventory = await this.inventoryService.getInventoryForUser(userId);

    const fullUser: IFullUser = {
      user,
      player,
      stats,
      discoveries,
      achievements,
      inventory,
    } as IFullUser;

    await this.migrateAccount(fullUser);

    return fullUser;
  }

  async migrateAccount(user: IFullUser): Promise<void> {
    if (!user.player.profile.displayName) {
      user.player.profile = {
        ...user.player.profile,
        displayName: user.user.username,
      };
    }
  }
}
