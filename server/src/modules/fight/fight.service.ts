import { zeroStats } from '@helpers/stats';
import {
  ICombatTargetParams,
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
import { BadRequestException, Injectable } from '@nestjs/common';
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
    if (!fight) throw new BadRequestException('Fight not found');

    return this.em.remove<Fight>(fight);
  }

  private async convertPlayerToFightCharacter(
    player: Player,
  ): Promise<IFightCharacter> {
    const user = await this.userService.findUserById(player.userId);
    if (!user) throw new BadRequestException('User not found');

    const inventory = await this.inventoryService.getInventoryForUser(
      player.userId,
    );
    if (!inventory) throw new BadRequestException('Inventory not found');

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
      x: -1,
      y: -1,
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
      throw new BadRequestException('Invalid fight');

    const leftTiles = this.getEmptyTiles();
    const rightTiles = this.getEmptyTiles();

    const joinedTiles = [
      [...leftTiles[0], ...rightTiles[0]],
      [...leftTiles[1], ...rightTiles[1]],
      [...leftTiles[2], ...rightTiles[2]],
      [...leftTiles[3], ...rightTiles[3]],
    ];

    joinedTiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        tile.x = x;
        tile.y = y;
      });
    });

    const startPlayerTile = sample(leftTiles.flat()) as IFightTile;
    startPlayerTile.containedCharacters = [playerCharacters[0].characterId];

    const startMonsterTiles = sampleSize(
      rightTiles.flat(),
      monsterCharacters.length,
    ) as IFightTile[];
    startMonsterTiles.forEach((tile, index) => {
      tile.containedCharacters = [monsterCharacters[index].characterId];
    });

    const turnOrder = [...playerCharacters, ...monsterCharacters].map(
      (c) => c.characterId,
    );

    const fight = new Fight(
      [player.userId],
      turnOrder,
      playerCharacters,
      monsterCharacters,
      joinedTiles,
    );

    await this.fights.create(fight);
    await this.em.flush();

    return fight;
  }

  getTileAtPosition(fight: Fight, x: number, y: number): IFightTile {
    return fight.tiles[y][x];
  }

  getTileContainingCharacter(fight: Fight, characterId: string): IFightTile {
    const tiles = fight.tiles.flat();
    const tile = tiles.find((t) => t.containedCharacters.includes(characterId));
    if (!tile) throw new BadRequestException('Tile not found');

    return tile;
  }

  getCharacterFromFightForUserId(
    fight: Fight,
    userId: string,
  ): IFightCharacter | undefined {
    const allCharacters = [...fight.attackers, ...fight.defenders];
    return allCharacters.find((c) => c.userId === userId);
  }

  isActiveTurn(fight: Fight, userId: string) {
    const myCharacter = this.getCharacterFromFightForUserId(fight, userId);
    if (!myCharacter) throw new BadRequestException('Character not found');

    return fight.currentTurn === myCharacter.characterId;
  }

  moveCharacterBetweenTiles(
    characterId: string,
    startTile: IFightTile,
    endTile: IFightTile,
  ): void {
    startTile.containedCharacters = startTile.containedCharacters.filter(
      (char) => char !== characterId,
    );
    endTile.containedCharacters = [...endTile.containedCharacters, characterId];
  }

  distBetweenTiles(tileA: IFightTile, tileB: IFightTile): number {
    return Math.abs(tileA.x - tileB.x) + Math.abs(tileA.y - tileB.y);
  }

  async takeAction(
    userId: string,
    actionId: string,
    targetParams: ICombatTargetParams,
  ): Promise<void> {
    const fight = await this.getFightForUser(userId);
    if (!fight) throw new BadRequestException('Fight not found');

    if (!this.isActiveTurn(fight, userId))
      throw new BadRequestException('Not your turn');

    const action = this.contentService.getAbility(actionId);
    if (!action) throw new BadRequestException('Action not found');

    switch (action.specialAction) {
      case 'Flee': {
        return this.flee(fight);
      }

      case 'Move': {
        if (!targetParams.tile) throw new BadRequestException('No target tile');
        return this.move(fight, userId, targetParams.tile);
      }

      default: {
        // TODO: factor in targetInOrder
        console.log('default action', action, targetParams);
      }
    }
  }

  async move(
    fight: Fight,
    userId: string,
    newTileCoordinates: { x: number; y: number },
  ): Promise<void> {
    const character = this.getCharacterFromFightForUserId(fight, userId);
    if (!character) throw new BadRequestException('Character not found');

    const tile = this.getTileContainingCharacter(fight, character.characterId);
    if (!tile) throw new BadRequestException('Tile not found');

    const newTile = this.getTileAtPosition(
      fight,
      newTileCoordinates.x,
      newTileCoordinates.y,
    );
    if (!newTile) throw new BadRequestException('New tile not found');

    const dist = await this.distBetweenTiles(tile, newTile);
    if (dist > 1) throw new BadRequestException('Too far away');

    const side = newTileCoordinates.x < 4 ? 'left' : 'right';
    const targetAffiliation = fight.attackers.includes(character)
      ? 'left'
      : 'right';

    if (side !== targetAffiliation)
      throw new BadRequestException('Cannot move to enemy side');

    this.moveCharacterBetweenTiles(character.characterId, tile, newTile);

    await this.saveAndUpdateFight(fight);
  }

  async flee(fight: Fight): Promise<void> {
    await this.removeFight(fight._id.toHexString());

    await Promise.all(
      fight.involvedPlayers.map(async (playerId) => {
        const player = await this.playerService.getPlayerForUser(playerId);
        if (!player) throw new BadRequestException('Player not found');

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
      }),
    );

    await this.em.flush();
  }

  async saveAndUpdateFight(fight: Fight): Promise<void> {
    await this.saveFight(fight);
    await this.updateFightForAllPlayers(fight);
  }

  async saveFight(fight: Fight): Promise<void> {
    await this.em.nativeUpdate(Fight, { _id: new ObjectId(fight.id) }, fight);
    await this.em.flush();
  }

  async updateFightForAllPlayers(fight: Fight): Promise<void> {
    await Promise.all(
      fight.involvedPlayers.map(async (playerId) => {
        const player = await this.playerService.getPlayerForUser(playerId);
        if (!player) throw new BadRequestException('Player not found');

        this.emit(playerId, {
          fight,
          player,
        });
      }),
    );
  }
}
