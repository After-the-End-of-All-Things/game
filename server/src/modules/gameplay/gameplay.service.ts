import { ILocation, TrackedStat, UserResponse } from '@interfaces';
import { AnalyticsService } from '@modules/content/analytics.service';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { FightService } from '@modules/fight/fight.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { StatsService } from '@modules/stats/stats.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { sample } from 'lodash';
import { Logger } from 'nestjs-pino';

type ExploreResult =
  | 'Nothing'
  | 'Wave'
  | 'Item'
  | 'Discovery'
  | 'Collectible'
  | 'Resource'
  | 'Monster'
  | 'NPC';

const createFilledArray = (length: number, fill: ExploreResult) =>
  Array(length).fill(fill);

@Injectable()
export class GameplayService {
  constructor(
    private readonly logger: Logger,
    private readonly playerService: PlayerService,
    private readonly discoveriesService: DiscoveriesService,
    private readonly statsService: StatsService,
    private readonly constantsService: ConstantsService,
    private readonly contentService: ContentService,
    private readonly analyticsService: AnalyticsService,
    private readonly playerHelper: PlayerHelperService,
    private readonly fights: FightService,
    private readonly events: EventEmitter2,
  ) {}

  async explore(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException('Player not found');

    const fight = await this.fights.getFightForUser(userId);
    if (fight) throw new ForbiddenException('Cannot explore while fighting');

    if (player.location.cooldown > Date.now())
      return { player: [], discoveries: [] };

    if (player.action?.actionData?.stopExplore) {
      throw new ForbiddenException("You can't explore right now!");
    }

    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      userId,
    );

    if (!discoveries) throw new NotFoundException('Discoveries not found');

    let foundLocation: ILocation | undefined;

    foundLocation = this.contentService.getLocation(player.location.current);

    if (!foundLocation) {
      foundLocation = this.contentService.getLocation('Mork');
    }

    if (!foundLocation) return { player: [], discoveries: [] };

    let exploreResult: ExploreResult = 'Nothing';

    if (foundLocation) {
      const choices = [
        ...createFilledArray(
          this.constantsService.wavePercentBoost +
            foundLocation.baseStats.wave || 0,
          'Wave',
        ),
        ...createFilledArray(
          this.constantsService.locationFindPercentBoost +
            foundLocation.baseStats.locationFind || 0,
          'Discovery',
        ),
        ...createFilledArray(
          this.constantsService.itemFindPercentBoost +
            foundLocation.baseStats.itemFind || 0,
          'Item',
        ),
        ...createFilledArray(
          this.constantsService.collectibleFindPercentBoost +
            foundLocation.baseStats.collectibleFind || 0,
          'Collectible',
        ),
        ...createFilledArray(
          this.constantsService.resourceFindPercentBoost +
            foundLocation.baseStats.resourceFind || 0,
          'Resource',
        ),
        ...createFilledArray(
          this.constantsService.monsterFindPercentBoost +
            foundLocation.baseStats.monsterFind || 0,
          'Monster',
        ),
        ...createFilledArray(
          this.constantsService.npcFindPercentBoost +
            foundLocation.baseStats.npcEncounter || 0,
          'NPC',
        ),
      ];

      if (choices.length < 100) {
        const nothings = createFilledArray(100 - choices.length, 'Nothing');
        choices.push(...nothings);
      }

      exploreResult = sample(choices);

      this.analyticsService.sendDesignEvent(
        userId,
        `Gameplay:Explore:${foundLocation.name}:${exploreResult}`,
      );
    }

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        if (!foundLocation) return;

        playerRef.location = {
          ...playerRef.location,
          current: foundLocation.name,
        };

        // gain xp
        const baseXp = this.constantsService.baseExploreXp;
        const xpGainPercent = foundLocation.baseStats.xpGain;
        const xpGained = Math.floor(
          baseXp *
            (xpGainPercent / 100) *
            (this.constantsService.exploreXpMultiplier / 100),
        );

        this.playerHelper.gainXp(playerRef, xpGained);

        // gain coins
        const baseCoins = this.constantsService.baseExploreCoins;
        const coinsGainPercent = foundLocation.baseStats.coinGain;
        const coinsGained = Math.floor(baseCoins * (coinsGainPercent / 100));

        this.playerHelper.gainCoins(playerRef, coinsGained);

        // get cooldown
        const baseExploreSpeed = this.constantsService.baseExploreSpeed;
        const explorePercent = foundLocation.baseStats.exploreSpeed;
        const totalExploreSpeed = Math.max(
          1,
          baseExploreSpeed * (explorePercent / 100),
        );

        // reset explore action
        this.playerService.setPlayerAction(playerRef, undefined);

        const secondsAddedToCooldown = Math.floor(
          (this.constantsService.exploreSpeedMultiplier / 100) *
            totalExploreSpeed *
            1000,
        );

        // put explore on cooldown
        playerRef.location = {
          ...playerRef.location,
          cooldown: Date.now() + secondsAddedToCooldown,
        };

        // travel via walk if the flags are set
        if (playerRef.location.goingTo && playerRef.location.arrivesAt > 0) {
          playerRef.location = {
            ...playerRef.location,
            arrivesAt: playerRef.location.arrivesAt - 1,
          };

          if (playerRef.location.arrivesAt <= 0) {
            playerRef.location = {
              ...playerRef.location,
              current: playerRef.location.goingTo,
              goingTo: '',
              arrivesAt: 0,
            };

            this.events.emit('sync.player', player);
          }
        }

        if (exploreResult === 'Wave') {
          await this.playerService.handleRandomWave(playerRef);
        }

        if (exploreResult === 'Collectible') {
          await this.playerService.handleFindCollectible(
            playerRef,
            foundLocation,
          );
        }

        if (exploreResult === 'Resource') {
          await this.playerService.handleFindResource(playerRef, foundLocation);
        }

        if (exploreResult === 'Item') {
          await this.playerService.handleFindItem(playerRef, foundLocation);
        }

        if (exploreResult === 'Monster') {
          await this.playerService.handleFindMonster(playerRef, foundLocation);
        }

        if (exploreResult === 'NPC') {
          await this.playerService.handleFindNPC(playerRef, foundLocation);
        }
      },
    );

    const discoveriesPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discRef) => {
        if (!foundLocation) return;

        if (exploreResult === 'Discovery') {
          await this.discoveriesService.handleExploreDiscoveries(
            player,
            discRef,
            foundLocation,
          );
        }
      },
    );

    this.logger.verbose(
      `Explore result: ${exploreResult} for player ${userId} in ${player.location.current}.`,
    );

    await this.statsService.incrementStat(
      userId,
      'timesExplored' as TrackedStat,
      1,
    );

    return { player: playerPatches, discoveries: discoveriesPatches };
  }

  async startFight(userId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException('Player not found');

    const existingFight = await this.fights.getFightForUser(userId);
    if (existingFight)
      throw new ForbiddenException('Fight already in progress');

    const formationId = player.action?.actionData.formation.itemId;
    const formation = this.contentService.getFormation(formationId);
    if (!formation) throw new NotFoundException('Formation not found');

    const fight = await this.fights.createPvEFightForSinglePlayer(
      player,
      formation,
    );
    if (!fight) throw new ForbiddenException('Fight not created');

    this.analyticsService.sendDesignEvent(
      userId,
      `Gameplay:StartFight:${player.location.current}:${formation.name}`,
    );

    return {
      fight,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You started a fight with ${formation.name}!`,
        },
        {
          type: 'ChangePage',
          newPage: 'combat',
        },
      ],
    };
  }
}
