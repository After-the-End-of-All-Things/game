import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConstantsService {
  public readonly baseExploreXp = 5;
  public readonly baseExploreCoins = 3;
  public readonly baseExploreSpeed = 3;

  constructor(private readonly configService: ConfigService) {
    this.baseExploreXp = this.configService.get('BASE_EXPLORE_XP', 5);
    this.baseExploreCoins = this.configService.get('BASE_EXPLORE_COINS', 3);
    this.baseExploreSpeed = this.configService.get('BASE_EXPLORE_SPEED', 3);
  }
}
