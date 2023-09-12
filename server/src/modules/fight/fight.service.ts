import { delayTime } from '@helpers/promise';
import {
  ICombatAbility,
  ICombatTargetParams,
  IFightCharacter,
  IFightTile,
  IMonster,
  IMonsterFormation,
  TrackedStat,
  UserResponse,
} from '@interfaces';
import { EntityManager, EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import {
  addAbilityElementsToFight,
  addStatusMessage,
  applyAbilityCooldown,
  calculateAbilityDamageWithElements,
  clearStatusMessage,
  didAttackersWinFight,
  distBetweenTiles,
  doDamageToTargetForAbility,
  getAllFightCharacters,
  getAllTilesMatchingPatternTargets,
  getCharacterFromFightForCharacterId,
  getCharacterFromFightForUserId,
  getCharacterSide,
  getEmptyTiles,
  getTargetsForAIAbility,
  getTargetsForAbility,
  getTargettedTilesForPattern,
  getTileAtPosition,
  getTileContainingCharacter,
  isActiveTurn,
  isDead,
  isFightOver,
  isValidTarget,
  moveCharacterBetweenTiles,
  reduceAllCooldownsForCharacter,
} from '@modules/fight/fight.helpers';
import { Fight } from '@modules/fight/fight.schema';
import { InventoryService } from '@modules/inventory/inventory.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { StatsService } from '@modules/stats/stats.service';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { Operation } from 'fast-json-patch';
import { sample, sampleSize, sum } from 'lodash';
import { Logger } from 'nestjs-pino';
import { v4 as uuid } from 'uuid';

const DELAY_BETWEEN_ROUNDS = 3000;
const DELAY_BETWEEN_TURNS = 200;

@Injectable()
export class FightService {
  constructor(
    private readonly logger: Logger,
    private readonly em: EntityManager,
    @InjectRepository(Fight)
    private readonly fights: EntityRepository<Fight>,
    private readonly contentService: ContentService,
    private readonly constantsService: ConstantsService,
    private readonly playerService: PlayerService,
    private readonly playerHelperService: PlayerHelperService,
    private readonly userService: UserService,
    private readonly inventoryService: InventoryService,
    private readonly discoveriesService: DiscoveriesService,
    private readonly statsService: StatsService,
    private events: EventEmitter2,
  ) {}

  private emit(userId: string, data: UserResponse = {}) {
    this.events.emit('userdata.send', {
      userId,
      data,
    });
  }

  public async getFightById(fightId: string): Promise<Fight | null> {
    return this.fights.findOne({ _id: new ObjectId(fightId) });
  }

  public async getFightForUser(userId: string): Promise<Fight | null> {
    return this.fights.findOne({ involvedPlayers: userId });
  }

  public async getValidFightForUser(userId: string): Promise<Fight | null> {
    const fight = await this.getFightForUser(userId);
    if (!fight) return null;

    const currentTurnCharacter = getCharacterFromFightForCharacterId(
      fight,
      fight.currentTurn,
    );
    if (!currentTurnCharacter || !currentTurnCharacter.characterId) {
      this.logger.log(
        `Fight ${fight._id} has no valid current turn player; removing...`,
      );
      await this.removeFight(fight);
      return null;
    }

    return fight;
  }

  public async removeFight(fight: Fight) {
    return this.em.remove<Fight>(fight);
  }

  public async removeFightById(fightId: string) {
    const fight = await this.getFightById(fightId);
    if (!fight) return;

    return this.removeFight(fight);
  }

  private async convertPlayerToFightCharacter(
    player: Player,
  ): Promise<IFightCharacter> {
    const user = await this.userService.findUserById(player.userId);
    if (!user) throw new NotFoundException('User not found');

    const inventory = await this.inventoryService.getInventoryForUser(
      player.userId,
    );
    if (!inventory) throw new NotFoundException('Inventory not found');

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
      totalStats,
      baseResistances: totalResistances,
      totalResistances,
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
      totalStats: monster.statBoosts,
      baseResistances: monster.resistances,
      totalResistances: monster.resistances,
      equipment: {},
      cooldowns: {},
      killRewards: monster.rewards,
    };
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

    const leftTiles = getEmptyTiles();
    const rightTiles = getEmptyTiles();

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

    try {
      await this.fights.create(fight);
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      await this.em.flush();
    }

    this.logger.verbose(
      `Created PvE fight for player ${player.userId} (${fight._id})`,
    );

    return fight;
  }

  async startEndFightSequence(fight: Fight): Promise<void> {
    await this.handleFightRewards(fight);
    await delayTime(DELAY_BETWEEN_ROUNDS);
    await this.endFight(fight);
  }

  async endFight(fight: Fight, actions: any[] = []): Promise<void> {
    const checkFight = await this.getFightById(fight.id);
    if (!checkFight) return;

    this.logger.verbose(`Ending fight ${fight._id}`);

    await this.removeFight(fight);

    await Promise.all(
      fight.involvedPlayers.map(async (playerId) => {
        const player = await this.playerService.getPlayerForUser(playerId);
        if (!player) throw new NotFoundException('Player not found');

        this.playerService.setPlayerAction(player, undefined);

        this.emit(playerId, {
          fight: null,
          player,
          actions,
        });
      }),
    );

    await this.em.flush();
  }

  async handleFightRewards(fight: Fight): Promise<void> {
    let xpDelta = 0;
    let coinDelta = 0;
    let isWin = false;

    if (!didAttackersWinFight(fight)) {
      const xpLost = Math.floor(
        (this.constantsService.combatXpLossMultiplier / 100) *
          sum(fight.defenders.map((c) => c.killRewards?.xp ?? 0)),
      );
      const coinsLost = Math.floor(
        (this.constantsService.combatCoinLossMultiplier / 100) *
          sum(fight.defenders.map((c) => c.killRewards?.coins ?? 0)),
      );

      addStatusMessage(fight, 'Fight', 'You lost the fight!');
      addStatusMessage(
        fight,
        'Fight',
        `You lost ${xpLost.toLocaleString()} XP!`,
      );
      addStatusMessage(
        fight,
        'Fight',
        `You lost ${coinsLost.toLocaleString()} coins!`,
      );

      xpDelta = -xpLost;
      coinDelta = -coinsLost;
    } else {
      isWin = true;
      const xpGained = sum(fight.defenders.map((c) => c.killRewards?.xp ?? 0));
      const coinsGained = sum(
        fight.defenders.map((c) => c.killRewards?.coins ?? 0),
      );

      addStatusMessage(fight, 'Fight', 'You won the fight!');
      addStatusMessage(
        fight,
        'Fight',
        `You gained ${xpGained.toLocaleString()} XP!`,
      );
      addStatusMessage(
        fight,
        'Fight',
        `You gained ${coinsGained.toLocaleString()} coins!`,
      );

      xpDelta = xpGained;
      coinDelta = coinsGained;
    }

    this.logger.verbose(
      `Fight ${fight._id} rewarded ${xpDelta} XP and ${coinDelta} coins.`,
    );

    await Promise.all(
      fight.involvedPlayers.map(async (playerId) => {
        const player = await this.playerService.getPlayerForUser(playerId);
        if (!player) throw new NotFoundException('Player not found');

        const discoveries = await this.discoveriesService.getDiscoveriesForUser(
          player.userId,
        );
        if (!discoveries) throw new NotFoundException('Discoveries not found');

        if (fight.defenders.length > 0 && fight.attackers.length > 0) {
          await this.statsService.incrementStat(
            player.userId,
            (isWin ? 'combatWins' : 'combatLosses') as TrackedStat,
            1,
          );
        }

        const allMonsterIds = fight.defenders
          .map((c) => c.monsterId)
          .filter(Boolean) as string[];

        const playerPatches = await getPatchesAfterPropChanges(
          player,
          async (player) => {
            this.playerHelperService.gainXp(player, xpDelta);
            this.playerHelperService.gainCoins(player, coinDelta);
          },
        );

        let discoveryPatches: Operation[] = [];

        if (isWin) {
          discoveryPatches = await getPatchesAfterPropChanges(
            discoveries,
            async () => {
              await Promise.all(
                allMonsterIds.map((monsterId) => {
                  return this.discoveriesService.discoverMonster(
                    player.userId,
                    monsterId,
                  );
                }),
              );
            },
          );
        }

        this.emit(playerId, {
          player: playerPatches,
          discoveries: discoveryPatches,
        });
      }),
    );

    await this.em.flush();
  }

  async setAndTakeNextTurn(fight: Fight): Promise<void> {
    if (isFightOver(fight)) {
      return this.startEndFightSequence(fight);
    }

    this.logger.verbose(`Setting and taking next turn for fight ${fight._id}`);

    await this.setNextTurn(fight);
    await this.takeNextTurn(fight);
  }

  async setNextTurn(fight: Fight): Promise<void> {
    const currentTurnIndex = fight.turnOrder.findIndex(
      (turn) => turn === fight.currentTurn,
    );
    const nextTurnIndex = (currentTurnIndex + 1) % fight.turnOrder.length;

    if (nextTurnIndex === 0) {
      await delayTime(DELAY_BETWEEN_ROUNDS);
      clearStatusMessage(fight);
    }

    const currentCharacter = getCharacterFromFightForCharacterId(
      fight,
      fight.currentTurn,
    );

    if (!currentCharacter) throw new NotFoundException('Character not found');

    this.logger.verbose(
      `Setting next turn for fight ${fight._id} - ${fight.currentTurn}`,
    );

    reduceAllCooldownsForCharacter(currentCharacter);

    fight.currentTurn = fight.turnOrder[nextTurnIndex];

    const nextCharacter = getCharacterFromFightForCharacterId(
      fight,
      fight.currentTurn,
    );

    if (!nextCharacter) throw new NotFoundException('Character not found');

    if (isDead(nextCharacter)) {
      this.logger.verbose(
        `Skipping turn for dead character ${nextCharacter.characterId} in fight ${fight._id}`,
      );
      await this.setAndTakeNextTurn(fight);
      return;
    }

    await this.saveAndUpdateFight(fight);
  }

  async takeNextTurn(fight: Fight): Promise<void> {
    const nextCharacter = getCharacterFromFightForCharacterId(
      fight,
      fight.currentTurn,
    );

    if (!nextCharacter) throw new NotFoundException('Character not found');

    if (isDead(nextCharacter)) {
      this.logger.verbose(
        `Skipping turn for dead character ${nextCharacter.characterId} in fight ${fight._id}`,
      );
      await this.setAndTakeNextTurn(fight);
      return;
    }

    if (nextCharacter.userId) {
      await this.statsService.incrementStat(
        nextCharacter.userId,
        'combatTurnsTaken' as TrackedStat,
        1,
      );
    }

    if (nextCharacter.monsterId) {
      this.logger.verbose(
        `Taking next turn for monster ${nextCharacter.monsterId} in fight ${fight._id}`,
      );
      await this.aiTakeAction(fight, fight.currentTurn);
    }
  }

  async takeAction(
    userId: string,
    actionId: string,
    targetParams: ICombatTargetParams,
  ): Promise<void> {
    const fight = await this.getFightForUser(userId);
    if (!fight) throw new NotFoundException('Fight not found');
    if (!isActiveTurn(fight, userId))
      throw new BadRequestException('Not your turn');

    const action = this.contentService.getAbility(actionId);
    if (!action) throw new NotFoundException('Action not found');

    const character = getCharacterFromFightForUserId(fight, userId);
    if (!character) throw new NotFoundException('Character not found');

    this.logger.verbose(
      `Taking action ${action.name} for character ${character.characterId} in fight ${fight._id}`,
    );

    await this.processActionIntoAbility(fight, character, action, targetParams);

    await this.setAndTakeNextTurn(fight);
  }

  async processActionIntoAbility(
    fight: Fight,
    character: IFightCharacter,
    action: ICombatAbility,
    targetParams: ICombatTargetParams,
  ): Promise<void> {
    if (character.userId) {
      await this.statsService.incrementStat(
        character.userId,
        'combatActionsTaken' as TrackedStat,
        1,
      );
    }

    switch (action.specialAction) {
      case 'Flee': {
        return this.flee(fight);
      }

      case 'Move': {
        if (!targetParams.tile) throw new BadRequestException('No target tile');

        await this.move(fight, character, targetParams.tile);
        break;
      }

      default: {
        await this.handleAbility(fight, character, action, targetParams);
        break;
      }
    }
  }

  canUseAbility(character: IFightCharacter, ability: ICombatAbility): boolean {
    if (!ability.requiredEquipment) return true;

    return Object.values(character.equipment || {}).some((item) => {
      return item.type === ability.requiredEquipment;
    });
  }

  async handleAbility(
    fight: Fight,
    character: IFightCharacter,
    action: ICombatAbility,
    targetParams: ICombatTargetParams,
  ): Promise<void> {
    const { requiredJob, requiredLevel } = action;
    if (requiredJob && character.job !== requiredJob)
      throw new BadRequestException('Wrong job');
    if (requiredLevel && character.level < requiredLevel)
      throw new BadRequestException('Not high enough level');
    if (character.cooldowns[action.itemId])
      throw new BadRequestException('Ability is on cooldown');
    if (!isValidTarget(fight, character, action, targetParams)) {
      throw new BadRequestException('Invalid target');
    }
    if (!this.canUseAbility(character, action))
      throw new BadRequestException('Cannot use this ability');

    addAbilityElementsToFight(fight, action);
    applyAbilityCooldown(character, action);

    const targets = getTargetsForAbility(fight, action, targetParams);
    await Promise.all(
      targets.map(async (target) => {
        const damage = calculateAbilityDamageWithElements(
          fight.generatedElements,
          action,
          character,
          target,
        );

        doDamageToTargetForAbility(fight, character, target, damage);

        if (target.userId) {
          await this.statsService.incrementStat(
            target.userId,
            'combatAttacksReceived' as TrackedStat,
            1,
          );

          if (isDead(target)) {
            await this.statsService.incrementStat(
              target.userId,
              'combatDeaths' as TrackedStat,
              1,
            );
          }
        }

        if (target.monsterId && character.userId) {
          await this.statsService.incrementStat(
            character.userId,
            'combatAttacksGiven' as TrackedStat,
            1,
          );

          if (isDead(target)) {
            await this.statsService.incrementStat(
              character.userId,
              'combatKills' as TrackedStat,
              1,
            );
          }
        }
      }),
    );

    this.logger.verbose(
      `Handling ability ${action.name} for character ${character.characterId} in fight ${fight._id}`,
    );
    await this.saveAndUpdateFight(fight);
  }

  async aiTakeAction(fight: Fight, characterId: string): Promise<void> {
    const characterRef = getAllFightCharacters(fight).find(
      (char) => char.characterId === characterId,
    );
    if (!characterRef || !characterRef.monsterId)
      return this.setAndTakeNextTurn(fight);

    const monsterRef = this.contentService.getMonster(characterRef.monsterId);
    if (!monsterRef) return this.setAndTakeNextTurn(fight);

    const abilities = monsterRef.abilities;
    if (abilities.length === 0) {
      addStatusMessage(
        fight,
        characterRef.name,
        `${characterRef.name} is idling...`,
      );
      return this.setAndTakeNextTurn(fight);
    }

    const validAbilities = abilities.filter(
      (ability) => (characterRef.cooldowns[ability.ability] ?? 0) <= 0,
    );
    if (validAbilities.length === 0) return this.setAndTakeNextTurn(fight);

    const ability = sample(abilities);
    if (!ability) return this.setAndTakeNextTurn(fight);

    const abilityRef = this.contentService.getAbility(ability.ability);
    if (!abilityRef) return this.setAndTakeNextTurn(fight);

    const targetParams = getTargetsForAIAbility(
      fight,
      abilityRef,
      characterRef,
    );
    if (
      !targetParams ||
      (targetParams.characterIds && targetParams.characterIds.length === 0)
    ) {
      addStatusMessage(
        fight,
        characterRef.name,
        `${characterRef.name} is confused!`,
      );
      return this.setAndTakeNextTurn(fight);
    }

    let finalizedTargetParams = targetParams;
    if (abilityRef.requiresTileSelection) {
      const characterId = sample(targetParams.characterIds ?? []);
      if (!characterId) return this.setAndTakeNextTurn(fight);

      const currentTile = getTileContainingCharacter(fight, characterId);
      if (!currentTile) return this.setAndTakeNextTurn(fight);

      const patternTiles = getTargettedTilesForPattern(
        currentTile.x,
        currentTile.y,
        abilityRef.pattern,
      );

      let matchingTiles = getAllTilesMatchingPatternTargets(
        fight,
        patternTiles,
      );

      if (abilityRef.restrictTileSelectionToUserSide) {
        const side = getCharacterSide(fight, characterRef);
        if (side === 'attacker') {
          matchingTiles = matchingTiles.filter((tile) => tile.x <= 3);
        } else {
          matchingTiles = matchingTiles.filter((tile) => tile.x > 3);
        }
      }

      const chosenTile = sample(matchingTiles);
      if (!chosenTile) return this.setAndTakeNextTurn(fight);

      finalizedTargetParams = { tile: chosenTile };
    }

    this.logger.verbose(
      `AI taking action ${abilityRef.name} for character ${characterRef.characterId} in fight ${fight._id}`,
    );

    await this.processActionIntoAbility(
      fight,
      characterRef,
      abilityRef,
      finalizedTargetParams,
    );

    await delayTime(DELAY_BETWEEN_TURNS);
    await this.setAndTakeNextTurn(fight);
  }

  async move(
    fight: Fight,
    character: IFightCharacter,
    newTileCoordinates: { x: number; y: number },
  ): Promise<void> {
    const tile = getTileContainingCharacter(fight, character.characterId);
    if (!tile) throw new NotFoundException('Tile not found');

    const newTile = getTileAtPosition(
      fight,
      newTileCoordinates.x,
      newTileCoordinates.y,
    );
    if (!newTile) throw new NotFoundException('New tile not found');

    const dist = distBetweenTiles(tile, newTile);
    if (dist > 1) throw new BadRequestException('Too far away');

    const side = newTileCoordinates.x < 4 ? 'left' : 'right';
    const targetAffiliation = fight.attackers.includes(character)
      ? 'left'
      : 'right';

    if (side !== targetAffiliation)
      throw new BadRequestException('Cannot move to enemy side');

    this.logger.verbose(
      `Moving character ${character.characterId} to tile ${newTile.x},${newTile.y} in fight ${fight._id}`,
    );

    moveCharacterBetweenTiles(character.characterId, tile, newTile);

    await this.saveAndUpdateFight(fight);
  }

  async flee(fight: Fight): Promise<void> {
    fight.defenders = [];

    this.logger.verbose(`Fleeing fight ${fight._id}`);

    await Promise.all(
      fight.involvedPlayers.map(async (userId) => {
        return this.statsService.incrementStat(
          userId,
          'combatFlees' as TrackedStat,
          1,
        );
      }),
    );

    await this.endFight(fight, [
      {
        type: 'Notify',
        messageType: 'success',
        message: `You fled from combat!`,
      },
    ]);
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
        if (!player) throw new NotFoundException('Player not found');

        this.emit(playerId, {
          fight,
          player,
        });
      }),
    );
  }
}
