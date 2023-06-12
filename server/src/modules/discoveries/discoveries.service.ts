import { EntityManager, EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class DiscoveriesService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Discoveries)
    private readonly players: EntityRepository<Discoveries>,
  ) {}

  async getDiscoveriesForUser(userId: string): Promise<Discoveries> {
    const dbPlayer = await this.players.findOne({ _id: new ObjectId(userId) });
    if (!dbPlayer) {
      return await this.createDiscoveriesForUser(userId);
    }

    return dbPlayer;
  }

  async createDiscoveriesForUser(
    userId: string,
  ): Promise<Discoveries | undefined> {
    const player = new Discoveries(userId);

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
