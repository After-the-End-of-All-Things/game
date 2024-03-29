import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Achievements } from '@modules/achievements/achievements.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly logger: Logger,
    private readonly em: EntityManager,
    @InjectRepository(Achievements)
    private readonly achievements: EntityRepository<Achievements>,
  ) {}

  async getAchievementsForUser(userId: string): Promise<Achievements> {
    const achievements = await this.getOrCreateAchievementsForUser(userId);
    if (!achievements) {
      throw new BadRequestException(`achievements id ${userId} not found.`);
    }

    return achievements;
  }

  private async getOrCreateAchievementsForUser(
    userId: string,
  ): Promise<Achievements | undefined> {
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
    } catch (e) {
      this.logger.error(e);

      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException(
          `achievements id ${userId} already in use.`,
        );
      }

      throw e;
    } finally {
      await this.em.flush();
    }

    return achievements;
  }
}
