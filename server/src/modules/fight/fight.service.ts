import { zeroStats } from '@helpers/stats';
import {
  IFightCharacter,
  IFightTile,
  IMonster,
  IMonsterFormation,
  UserResponse,
} from '@interfaces';
import { EntityManager, EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ContentService } from '@modules/content/content.service';
import { Fight } from '@modules/fight/fight.schema';
import { InventoryService } from '@modules/inventory/inventory.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { UserService } from '@modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { sample, sampleSize } from 'lodash';
import { fromEvent } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FightService {
  private readonly events = new EventEmitter2();

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Fight)
    private readonly fights: EntityRepository<Fight>,
    private readonly contentService: ContentService,
    private readonly playerService: PlayerService,
    private readonly userService: UserService,
    private readonly inventoryService: InventoryService,
  ) {}

  public subscribe(channel: string) {
    return fromEvent(this.events, channel);
  }

  public emit(channel: string, data: UserResponse = {}) {
    this.events.emit(channel, { data });
  }

  public async getFightForUser(userId: string): Promise<Fight | null> {
    return this.fights.findOne({ involvedPlayers: userId });
  }

  public async removeFight(fightId: string) {
    const fight = await this.fights.findOne({ _id: new ObjectId(fightId) });
    if (!fight) throw new Error('Fight not found');

    return this.em.remove<Fight>(fight);
  }

  private async convertPlayerToFightCharacter(
    player: Player,
  ): Promise<IFightCharacter> {
    const user = await this.userService.findUserById(player.userId);
    if (!user) throw new Error('User not found');

    const inventory = await this.inventoryService.getInventoryForUser(
      player.userId,
    );
    if (!inventory) throw new Error('Inventory not found');

    const totalStats = await this.playerService.getTotalStats(player);
    const totalResistances = await this.playerService.getTotalResistances(
      player,
    );

    return {
      userId: player.userId,
      characterId: uuid(),
      name: user.username,
      sprite: player.cosmetics.portrait,
      level: player.level,
      job: player.job,
      health: { current: totalStats.health, max: totalStats.health },
      baseStats: totalStats,
      modifiedStats: zeroStats(),
      resistances: totalResistances,
      equipment: inventory.equippedItems,
      cooldowns: {},
    };
  }

  private convertMonsterToFightCharacter(
    monster: IMonster,
    indexForLetter: number,
  ): IFightCharacter {
    return {
      monsterId: monster.itemId,
      characterId: uuid(),
      name: `${monster.name} ${String.fromCharCode(65 + indexForLetter)}`,
      sprite: monster.sprite,
      level: monster.level,
      job: monster.job,
      health: {
        current: monster.statBoosts.health,
        max: monster.statBoosts.health,
      },
      baseStats: monster.statBoosts,
      modifiedStats: zeroStats(),
      resistances: monster.resistances,
      equipment: {},
      cooldowns: {},
    };
  }

  private getEmptyTile(): IFightTile {
    return {
      containedCharacters: [],
    };
  }

  private getEmptyTiles(): IFightTile[][] {
    return [
      [
        this.getEmptyTile(),
        this.getEmptyTile(),
        this.getEmptyTile(),
        this.getEmptyTile(),
      ],

      [
        this.getEmptyTile(),
        this.getEmptyTile(),
        this.getEmptyTile(),
        this.getEmptyTile(),
      ],

      [
        this.getEmptyTile(),
        this.getEmptyTile(),
        this.getEmptyTile(),
        this.getEmptyTile(),
      ],

      [
        this.getEmptyTile(),
        this.getEmptyTile(),
        this.getEmptyTile(),
        this.getEmptyTile(),
      ],
    ];
  }

  public async createPvEFightForSinglePlayer(
    player: Player,
    formation: IMonsterFormation,
  ): Promise<Fight> {
    const playerCharacters = [await this.convertPlayerToFightCharacter(player)];
    const monsterCharacters = formation.monsters
      .map(({ monster }, index) => {
        const monsterData = this.contentService.getMonster(monster);
        if (!monsterData) return null;

        return this.convertMonsterToFightCharacter(monsterData, index);
      })
      .filter(Boolean) as IFightCharacter[];

    if (playerCharacters.length === 0 || monsterCharacters.length === 0)
      throw new Error('Invalid fight');

    const leftTiles = this.getEmptyTiles();
    const rightTiles = this.getEmptyTiles();

    const joinedTiles = [
      [...leftTiles[0], ...rightTiles[0]],
      [...leftTiles[1], ...rightTiles[1]],
      [...leftTiles[2], ...rightTiles[2]],
      [...leftTiles[3], ...rightTiles[3]],
    ];

    const startPlayerTile = sample(leftTiles.flat()) as IFightTile;
    startPlayerTile.containedCharacters = [playerCharacters[0].characterId];

    const startMonsterTiles = sampleSize(
      rightTiles.flat(),
      monsterCharacters.length,
    ) as IFightTile[];
    startMonsterTiles.forEach((tile, index) => {
      tile.containedCharacters = [monsterCharacters[index].characterId];
    });

    const fight = new Fight(
      [player.userId],
      playerCharacters,
      monsterCharacters,
      joinedTiles,
    );

    await this.fights.create(fight);
    await this.em.flush();

    return fight;
  }

  async flee(userId: string): Promise<void> {
    const fight = await this.getFightForUser(userId);
    if (!fight) throw new Error('Fight not found');

    await this.removeFight(fight._id.toHexString());

    await Promise.all(
      fight.involvedPlayers.map(async (playerId) => {
        const player = await this.playerService.getPlayerForUser(playerId);
        if (!player) throw new Error('Player not found');

        this.playerService.setPlayerAction(player, undefined);

        this.emit(playerId, {
          fight: null,
          player,
          actions: [
            {
              type: 'Notify',
              messageType: 'success',
              message: `You fled from combat!`,
            },
          ],
        });
        await this.em.flush();
      }),
    );
  }
}
