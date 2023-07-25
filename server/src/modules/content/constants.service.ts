import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConstantsService {
  public readonly exploreSpeedMultiplier: number = 100;
  public readonly exploreXpMultiplier: number = 100;

  public readonly maxInventorySize: number = 100;

  public readonly baseExploreXp: number = 5;
  public readonly baseExploreCoins: number = 3;
  public readonly baseExploreSpeed: number = 3;

  public readonly wavePercentBoost: number = 0;
  public readonly itemFindPercentBoost: number = 0;
  public readonly collectibleFindPercentBoost: number = 0;
  public readonly resourceFindPercentBoost: number = 0;
  public readonly locationFindPercentBoost: number = 0;

  public readonly craftingSpeedMultiplier: number = 100;

  constructor(private readonly configService: ConfigService) {
    this.exploreSpeedMultiplier = +this.configService.get<number>(
      'EXPLORE_SPEED_MULTIPLIER',
      100,
    );
    this.exploreXpMultiplier = +this.configService.get<number>(
      'EXPLORE_XP_MULTIPLIER',
      100,
    );

    this.maxInventorySize = +this.configService.get<number>(
      'MAX_INVENTORY_SIZE',
      100,
    );

    this.baseExploreXp = +this.configService.get<number>('BASE_EXPLORE_XP', 5);
    this.baseExploreCoins = +this.configService.get<number>(
      'BASE_EXPLORE_COINS',
      3,
    );
    this.baseExploreSpeed = +this.configService.get<number>(
      'BASE_EXPLORE_SPEED',
      3,
    );

    this.wavePercentBoost = +this.configService.get<number>(
      'WAVE_PERCENT_BOOST',
      0,
    );
    this.itemFindPercentBoost = +this.configService.get<number>(
      'ITEM_FIND_PERCENT_BOOST',
      0,
    );
    this.collectibleFindPercentBoost = +this.configService.get<number>(
      'COLLECTIBLE_FIND_PERCENT_BOOST',
      0,
    );
    this.resourceFindPercentBoost = +this.configService.get<number>(
      'RESOURCE_FIND_PERCENT_BOOST',
      0,
    );
    this.locationFindPercentBoost = +this.configService.get<number>(
      'LOCATION_FIND_PERCENT_BOOST',
      0,
    );

    this.craftingSpeedMultiplier = +this.configService.get<number>(
      'CRAFTING_SPEED_MULTIPLIER',
      100,
    );
  }
}
