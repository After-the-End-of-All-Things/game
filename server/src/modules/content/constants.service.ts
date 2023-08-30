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
  public readonly monsterFindPercentBoost: number = 0;

  public readonly craftingSpeedMultiplier: number = 100;

  public readonly combatXpLossMultiplier: number = 25;
  public readonly combatCoinLossMultiplier: number = 25;

  public readonly uniqueCollectiblesRequired: number = 10;
  public readonly totalCollectiblesRequired: number = 100;
  public readonly uniqueCollectibleRewardMultiplier: number = 50;
  public readonly totalCollectibleRewardMultiplier: number = 25;

  public readonly uniqueEquipmentRequired: number = 100;
  public readonly totalEquipmentRequired: number = 1000;
  public readonly uniqueEquipmentRewardMultiplier: number = 25;
  public readonly totalEquipmentRewardMultiplier: number = 10;

  public readonly uniqueMonstersRequired: number = 25;
  public readonly totalMonstersRequired: number = 250;
  public readonly uniqueMonsterRewardMultiplier: number = 25;
  public readonly totalMonsterRewardMultiplier: number = 10;

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
      'INVENTORY_MAX_SIZE',
      100,
    );

    this.baseExploreXp = +this.configService.get<number>('EXPLORE_BASE_XP', 5);
    this.baseExploreCoins = +this.configService.get<number>(
      'EXPLORE_BASE_COINS',
      3,
    );
    this.baseExploreSpeed = +this.configService.get<number>(
      'EXPLORE_BASE_SPEED',
      3,
    );

    this.wavePercentBoost = +this.configService.get<number>(
      'EXPLORE_EVENT_WAVE_PERCENT_BOOST',
      0,
    );
    this.itemFindPercentBoost = +this.configService.get<number>(
      'EXPLORE_EVENT_ITEM_FIND_PERCENT_BOOST',
      0,
    );
    this.collectibleFindPercentBoost = +this.configService.get<number>(
      'EXPLORE_EVENT_COLLECTIBLE_FIND_PERCENT_BOOST',
      0,
    );
    this.resourceFindPercentBoost = +this.configService.get<number>(
      'EXPLORE_EVENT_RESOURCE_FIND_PERCENT_BOOST',
      0,
    );
    this.locationFindPercentBoost = +this.configService.get<number>(
      'EXPLORE_EVENT_LOCATION_FIND_PERCENT_BOOST',
      0,
    );
    this.monsterFindPercentBoost = +this.configService.get<number>(
      'EXPLORE_EVENT_MONSTER_FIND_PERCENT_BOOST',
      0,
    );

    this.craftingSpeedMultiplier = +this.configService.get<number>(
      'CRAFTING_SPEED_MULTIPLIER',
      100,
    );

    this.combatXpLossMultiplier = +this.configService.get<number>(
      'COMBAT_XP_LOSS_MULTIPLIER',
      25,
    );
    this.combatCoinLossMultiplier = +this.configService.get<number>(
      'COMBAT_COIN_LOSS_MULTIPLIER',
      25,
    );

    this.uniqueCollectiblesRequired = +this.configService.get<number>(
      'COLLECTIONS_UNIQUE_COLLECTIBLES_REQUIRED',
      10,
    );

    this.totalCollectiblesRequired = +this.configService.get<number>(
      'COLLECTIONS_TOTAL_COLLECTIBLES_REQUIRED',
      100,
    );

    this.uniqueCollectibleRewardMultiplier = +this.configService.get<number>(
      'COLLECTIONS_UNIQUE_COLLECTIBLE_REWARD_MULTIPLIER',
      50,
    );

    this.totalCollectibleRewardMultiplier = +this.configService.get<number>(
      'COLLECTIONS_TOTAL_COLLECTIBLE_REWARD_MULTIPLIER',
      25,
    );

    this.uniqueEquipmentRequired = +this.configService.get<number>(
      'COLLECTIONS_UNIQUE_EQUIPMENT_REQUIRED',
      100,
    );

    this.totalEquipmentRequired = +this.configService.get<number>(
      'COLLECTIONS_TOTAL_EQUIPMENT_REQUIRED',
      1000,
    );

    this.uniqueEquipmentRewardMultiplier = +this.configService.get<number>(
      'COLLECTIONS_UNIQUE_EQUIPMENT_REWARD_MULTIPLIER',
      25,
    );

    this.totalEquipmentRewardMultiplier = +this.configService.get<number>(
      'COLLECTIONS_TOTAL_EQUIPMENT_REWARD_MULTIPLIER',
      10,
    );

    this.uniqueMonstersRequired = +this.configService.get<number>(
      'COLLECTIONS_UNIQUE_MONSTERS_REQUIRED',
      25,
    );

    this.totalMonstersRequired = +this.configService.get<number>(
      'COLLECTIONS_TOTAL_MONSTERS_REQUIRED',
      250,
    );

    this.uniqueMonsterRewardMultiplier = +this.configService.get<number>(
      'COLLECTIONS_UNIQUE_MONSTER_REWARD_MULTIPLIER',
      25,
    );

    this.totalMonsterRewardMultiplier = +this.configService.get<number>(
      'COLLECTIONS_TOTAL_MONSTER_REWARD_MULTIPLIER',
      10,
    );
  }
}
