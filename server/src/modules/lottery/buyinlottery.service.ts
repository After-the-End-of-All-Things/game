import { UserResponse } from '@interfaces';
import { NotFoundError } from '@mikro-orm/core';
import { EntityManager, EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConstantsService } from '@modules/content/constants.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { LotteryBuyInTicket } from '@modules/lottery/buyinlottery.schema';
import { LotteryBuyInDraw } from '@modules/lottery/buyinlotterydraw.schema';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { endOfToday, startOfToday } from '@utils/date';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { random } from 'lodash';

@Injectable()
export class BuyInLotteryService implements OnModuleInit {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(LotteryBuyInTicket)
    private readonly buyinTickets: EntityRepository<LotteryBuyInTicket>,
    private readonly playerService: PlayerService,
    private readonly playerHelper: PlayerHelperService,
    private readonly events: EventEmitter2,
    private readonly constants: ConstantsService,
  ) {}

  public async onModuleInit() {
    const shouldAddBuyIn = await this.shouldAddNewBuyInDailyLotteryRecord();
    if (shouldAddBuyIn) {
      await this.drawNewDailyLotteryTicketNumber();
    }
  }

  private async getBuyInLotteryRecordForToday(
    forUserId = '',
  ): Promise<LotteryBuyInDraw | null> {
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

    return this.em.fork().findOne(LotteryBuyInDraw, query);
  }

  private async shouldAddNewBuyInDailyLotteryRecord(): Promise<boolean> {
    const record = await this.getBuyInLotteryRecordForToday();
    return !record;
  }

  private generateBuyTicketNumber(): string {
    const r = () => random(0, 9);
    return `${r()}${r()}${r()}${r()}${r()}`;
  }

  @Cron(CronExpression.EVERY_DAY_AT_6PM, { name: 'buyinlottery' })
  private async drawNewDailyLotteryTicketNumber() {
    const emCtx = this.em.fork();

    const newRecord = new LotteryBuyInDraw(this.generateBuyTicketNumber());
    emCtx.persist(newRecord);
    await emCtx.flush();
  }

  public async buyTicket(userId: string): Promise<UserResponse> {
    const todayTicket = await this.getBuyInLotteryRecordForToday();
    if (!todayTicket) throw new NotFoundError('No ticket found for today');

    if (todayTicket.claimed) throw new Error('Ticket already claimed');

    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundError('User not found');

    if (
      !this.playerHelper.hasCoins(player, this.constants.buyinLotteryTicketCost)
    )
      throw new Error('Not enough coins');

    const ticketNumbers = await this.ticketNumbers(userId);
    if (ticketNumbers.length >= this.constants.buyinLotteryMaxTickets)
      throw new Error('Max tickets reached');

    const newTicket = new LotteryBuyInTicket(
      userId,
      this.generateBuyTicketNumber(),
    );
    await this.em.persistAndFlush(newTicket);

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.spendCoins(
          playerRef,
          this.constants.buyinLotteryTicketCost,
        );
      },
    );

    return {
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You bought a ticket for the ticket lottery for ${this.constants.buyinLotteryTicketCost.toLocaleString()} coins. Your ticket number is ${
            newTicket.ticketNumber
          }.`,
        },
      ],
    };
  }

  public async ticketNumbers(userId: string): Promise<string[]> {
    const tickets = await this.buyinTickets.find({
      userId,
      createdAt: { $gte: startOfToday() },
    });

    return tickets.map((t) => t.ticketNumber);
  }

  public async isWinnerToday(userId: string): Promise<boolean> {
    const todayTicket = await this.getBuyInLotteryRecordForToday();
    if (!todayTicket) return false;

    const tickets = await this.ticketNumbers(userId);
    if (!tickets.length) return false;

    return tickets.some((t) => t === todayTicket.ticketNumber);
  }

  public async ticketValueSum(): Promise<number> {
    const allTickets = await this.buyinTickets.count();
    return allTickets * this.constants.buyinLotteryTicketCost;
  }

  public async claimTicket(userId: string): Promise<UserResponse> {
    const isWinner = await this.isWinnerToday(userId);
    if (!isWinner) throw new Error('Not a winner');

    const todayTicket = await this.getBuyInLotteryRecordForToday();
    if (!todayTicket) throw new NotFoundError('No ticket found for today');

    if (todayTicket.claimed) throw new Error('Ticket already claimed');

    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundError('User not found');

    const total = await this.ticketValueSum();

    await this.em.nativeUpdate(
      LotteryBuyInDraw,
      { _id: new ObjectId(todayTicket._id) },
      { claimed: true, winnerId: userId },
    );

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (playerRef) => {
        this.playerHelper.gainCoins(playerRef, total);

        this.events.emit('notification.create', {
          userId,
          notification: {
            liveAt: new Date(),
            text: `You have won the ticket lottery with ticket ${
              todayTicket.ticketNumber
            } and got ${total.toLocaleString()} coins!`,
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
      },
    );

    await this.buyinTickets.nativeDelete({});

    return {
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `Your ticket numbered ${
            todayTicket.ticketNumber
          } was a winner! You have been awarded ${total.toLocaleString()} coins.`,
        },
      ],
    };
  }
}
