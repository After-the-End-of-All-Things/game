import { UserResponse } from '@interfaces';
import { NotFoundError } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import { ConstantsService } from '@modules/content/constants.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { LotteryRandomDaily } from '@modules/lottery/dailylottery.schema';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { User } from '@modules/user/user.schema';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { endOfToday, startOfLastWeek, startOfToday } from '@utils/date';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { userError, userSuccessObject } from '@utils/usernotifications';

@Injectable()
export class DailyLotteryService implements OnModuleInit {
  constructor(
    private readonly em: EntityManager,
    private readonly playerService: PlayerService,
    private readonly playerHelper: PlayerHelperService,
    private readonly events: EventEmitter2,
    private readonly constants: ConstantsService,
  ) {}

  public async onModuleInit() {
    const shouldAddDaily = await this.shouldAddNewDailyLotteryRecord();
    if (shouldAddDaily) {
      await this.addNewPlayerLotteryRecord();
    }
  }

  public nextLotteryRecordTime(): Date {
    const nextLotteryRecordTime = new Date();
    nextLotteryRecordTime.setHours(this.constants.dailyLotteryPickHour);
    nextLotteryRecordTime.setMinutes(0);
    nextLotteryRecordTime.setSeconds(0);
    nextLotteryRecordTime.setMilliseconds(0);

    return nextLotteryRecordTime;
  }

  private async getLotteryRecordForToday(
    forUserId = '',
  ): Promise<LotteryRandomDaily | null> {
    const query: any = {
      $and: [
        { createdAt: { $gte: startOfToday() } },
        { createdAt: { $lte: endOfToday() } },
      ],
    };

    if (forUserId) {
      query.winnerId = forUserId;
      query.claimed = { $ne: true };
    }

    return this.em.fork().findOne(LotteryRandomDaily, query);
  }

  private async shouldAddNewDailyLotteryRecord(): Promise<boolean> {
    const record = await this.getLotteryRecordForToday();
    return !record;
  }

  @Cron(CronExpression.EVERY_DAY_AT_6PM, { name: 'playerlottery' })
  private async addNewPlayerLotteryRecord() {
    const emCtx = this.em.fork();

    const randomPlayers = await emCtx.aggregate(User, [
      { $match: { onlineUntil: { $gt: startOfLastWeek().getTime() } } },
      { $sample: { size: this.constants.dailyLotteryNumWinners } },
    ]);

    await Promise.all(
      randomPlayers.map(async (randomPlayer) => {
        const winnerId = randomPlayer._id.toString();

        const newRecord = new LotteryRandomDaily(winnerId);
        emCtx.persist(newRecord);
        await emCtx.flush();

        this.events.emit('notification.create', {
          userId: winnerId,
          notification: {
            liveAt: new Date(),
            text: `You have won the daily lottery!`,
            actions: [
              {
                text: 'Claim',
                action: 'navigate',
                actionData: { url: '/' },
              },
            ],
          },
          expiresAfterHours: 1,
        });
      }),
    );
  }

  public async isWinnerToday(userId: string): Promise<boolean> {
    const record = await this.getLotteryRecordForToday(userId);
    return !!record;
  }

  public async numPlayersOnlineInLastWeek(): Promise<number> {
    return this.em.count(User, {
      onlineUntil: { $gte: startOfLastWeek().getTime() },
    });
  }

  private async claimRecord(userId: string): Promise<void> {
    await this.em.nativeUpdate(
      LotteryRandomDaily,
      { winnerId: userId, claimed: { $ne: true } },
      { claimed: true },
    );
  }

  public async claimRewards(userId: string): Promise<UserResponse> {
    const record = await this.getLotteryRecordForToday(userId);
    if (!record) return userError('You are not the winner for today');

    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundError(`Player ${userId} not found`);

    const rewardScale = await this.numPlayersOnlineInLastWeek();

    const coinReward = rewardScale * 10;
    const oatReward = rewardScale;
    const xpReward = rewardScale * 100;

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.gainCoins(playerRef, coinReward);
        this.playerHelper.gainOats(playerRef, oatReward);
        this.playerHelper.gainXp(playerRef, xpReward);
      },
    );

    this.events.emit('notification.create', {
      userId,
      notification: {
        liveAt: new Date(),
        text: `You got ${coinReward.toLocaleString()} coins, ${oatReward.toLocaleString()} oats, and ${xpReward.toLocaleString()} XP from the daily lottery!`,
        actions: [],
      },
      expiresAfterHours: 1,
    });

    await this.claimRecord(userId);

    return {
      player: playerPatches,
      actions: [
        userSuccessObject(
          `You got ${coinReward.toLocaleString()} coins, ${oatReward.toLocaleString()} oats, and ${xpReward.toLocaleString()} XP!`,
        ),
      ],
    };
  }
}
