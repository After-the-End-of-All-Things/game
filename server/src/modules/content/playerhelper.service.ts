import { xpForLevel } from '@helpers/xp';
import { Currency, ICombatAbility } from '@interfaces';
import { ConstantsService } from '@modules/content/constants.service';
import { ContentService } from '@modules/content/content.service';
import { Player } from '@modules/player/player.schema';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { percentNumberAsMultiplier } from '@utils/number';

@Injectable()
export class PlayerHelperService {
  constructor(
    private constants: ConstantsService,
    private contentService: ContentService,
    private events: EventEmitter2,
  ) {}

  public isDeityTravelSpeedBuffActive(player: Player): boolean {
    return (player.deityBuffs?.travel ?? 0) > Date.now();
  }

  public isDeityXpBuffActive(player: Player): boolean {
    return (player.deityBuffs?.xp ?? 0) > Date.now();
  }

  public isDeityCoinsBuffActive(player: Player): boolean {
    return (player.deityBuffs?.coins ?? 0) > Date.now();
  }

  public isDeityOffenseBuffActive(player: Player): boolean {
    return (player.deityBuffs?.offense ?? 0) > Date.now();
  }

  public isDeityDefenseBuffActive(player: Player): boolean {
    return (player.deityBuffs?.defense ?? 0) > Date.now();
  }

  gainXp(player: Player, xp = 1) {
    if (this.isDeityXpBuffActive(player) && xp > 0) {
      xp = Math.floor(
        xp + xp * percentNumberAsMultiplier(this.constants.worshipXpBoost),
      );
    }

    player.xp = Math.max(0, player.xp + xp);
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
    if (this.isDeityCoinsBuffActive(player) && amount > 0) {
      amount = Math.floor(
        amount +
          amount * percentNumberAsMultiplier(this.constants.worshipCoinBoost),
      );
    }

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

  private abilitiesLearnedAtLevelForJob(
    job: string,
    level: number,
  ): ICombatAbility[] {
    return this.contentService
      .allAbilities()
      .filter(
        (ability) =>
          ability.requiredLevel === level && ability.requiredJob === job,
      );
  }

  private attemptLevelUpForPlayer(player: Player) {
    const requiredXp = xpForLevel(player.level + 1);
    if (player.xp < requiredXp) return;

    player.xp = 0;
    player.level += 1;

    this.events.emit('sync.player', player);

    const newAbilities = this.abilitiesLearnedAtLevelForJob(
      player.job,
      player.level,
    );

    const newAbilitiesString =
      newAbilities.length > 0
        ? `You have learned the following abilities: ${newAbilities
            .map((ability) => `"${ability.name}"`)
            .join(', ')}`
        : ``;

    this.events.emit('notification.create', {
      userId: player.userId,
      notification: {
        liveAt: new Date(),
        text: `You have reached ${player.job} level ${player.level}! ${newAbilitiesString}`,
        actions: [],
      },
      expiresAfterHours: 1,
    });
  }
}
