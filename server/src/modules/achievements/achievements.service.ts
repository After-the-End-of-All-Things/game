import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Achievements } from '@modules/achievements/achievements.schema';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Achievements)
    private readonly achievements: EntityRepository<Achievements>,
  ) {}

  async getAchievementsForUser(userId: string): Promise<Achievements> {
    const dbAchievements = await this.achievements.findOne({ userId });
    if (!dbAchievements) {
      return await this.createAchievementsForUser(userId);
    }

    return dbAchievements;
  }

  async createAchievementsForUser(
    userId: string,
  ): Promise<Achievements | undefined> {
    const achievements = new Achievements(userId);

    try {
      await this.achievements.create(achievements);
      await this.em.flush();
    } catch (e) {
      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException('achievements id already in use.');
      }
    }

    return achievements;
  }
}
