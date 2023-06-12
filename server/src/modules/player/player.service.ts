import { IPlayer } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Player } from '@modules/player/player.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { getPatchesAfterPropChanges } from '@utils/patches';
import * as jsonpatch from 'fast-json-patch';

@Injectable()
export class PlayerService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Player)
    private readonly players: EntityRepository<Player>,
  ) {}

  async getPlayerForUser(userId: string): Promise<Player> {
    const dbPlayer = await this.players.findOne({ userId });
    if (!dbPlayer) {
      return await this.createPlayerForUser(userId);
    }

    return dbPlayer;
  }

  async createPlayerForUser(userId: string): Promise<Player | undefined> {
    const player = new Player(userId);

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

  async updatePortraitForPlayer(
    userId: string,
    portrait: number,
  ): Promise<jsonpatch.Operation[]> {
    const player = await this.getPlayerForUser(userId);

    return getPatchesAfterPropChanges<IPlayer>(player, (playerRef) => {
      playerRef.cosmetics = { ...player.cosmetics, portrait };
    });
  }
}
