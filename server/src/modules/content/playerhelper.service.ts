import { xpForLevel } from '@helpers/xp';
import { Currency } from '@interfaces';
import { Player } from '@modules/player/player.schema';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PlayerHelperService {
  constructor(private events: EventEmitter2) {}

  gainXp(player: Player, xp = 1) {
    player.xp += xp;
    this.attemptLevelUpForPlayer(player);
  }

  gainCurrency(player: Player, amount = 1, currency: Currency) {
    const newCurrencyValue = Math.max(
      0,
      (player.currencies[currency] ?? 0) + amount,
    );
    player.currencies = { ...player.currencies, [currency]: newCurrencyValue };
  }

  gainCoins(player: Player, amount = 1) {
    this.gainCurrency(player, amount, 'coins' as Currency);
  }

  gainOats(player: Player, amount = 1) {
    this.gainCurrency(player, amount, 'oats' as Currency);
  }

  spendCurrency(player: Player, amount = 1, currency: Currency) {
    this.gainCurrency(player, -amount, currency);
  }

  spendCoins(player: Player, amount = 1) {
    this.spendCurrency(player, amount, 'coins' as Currency);
  }

  spendOats(player: Player, amount = 1) {
    this.spendCurrency(player, amount, 'oats' as Currency);
  }

  hasCurrency(player: Player, amount = 1, currency: Currency) {
    return player.currencies[currency] >= amount;
  }

  hasCoins(player: Player, amount = 1) {
    return this.hasCurrency(player, amount, 'coins' as Currency);
  }

  private attemptLevelUpForPlayer(player: Player) {
    const requiredXp = xpForLevel(player.level + 1);
    if (player.xp < requiredXp) return;

    player.xp = 0;
    player.level += 1;

    this.events.emit('notification.create', {
      userId: player.userId,
      notification: {
        liveAt: new Date(),
        text: `You have reached level ${player.level}!`,
        actions: [],
      },
      expiresAfterHours: 1,
    });
  }
}
