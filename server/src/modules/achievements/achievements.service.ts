import { EntityManager, EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Achievements } from '@modules/achievements/achievements.schema';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Achievements)
    private readonly players: EntityRepository<Achievements>,
  ) {}

  async getAchievementsForUser(userId: string): Promise<Achievements> {
    const dbPlayer = await this.players.findOne({ _id: new ObjectId(userId) });
    if (!dbPlayer) {
      return await this.createAchievementsForUser(userId);
    }

    return dbPlayer;
  }

  async createAchievementsForUser(
    userId: string,
  ): Promise<Achievements | undefined> {
    const player = new Achievements(userId);

    try {
      await this.players.create(player);
      await this.em.flush();
    } catch (e) {
      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException('player id already in use.');
      }
    }

    return player;
  }
}
