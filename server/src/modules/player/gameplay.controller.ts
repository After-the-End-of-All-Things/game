import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { InventoryService } from '@modules/inventory/inventory.service';
import { GameplayService } from '@modules/player/gameplay.service';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@utils/user.decorator';

@Controller('gameplay')
export class GameplayController {
  constructor(
    private gameplayService: GameplayService,
    private inventoryService: InventoryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('explore')
  async explore(@User() user) {
    return this.gameplayService.explore(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('walk')
  async walk(@User() user, @Body('location') location: string) {
    return {
      player: await this.gameplayService.walkToLocation(user.userId, location),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('travel')
  async travel(@User() user, @Body('location') location: string) {
    return {
      player: await this.gameplayService.travelToLocation(
        user.userId,
        location,
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('wave')
  async wave(
    @User() user,
    @Body('targetUserId') targetUserId: string,
    @Body('isWaveBack') isWaveBack: boolean,
  ) {
    return {
      player: await this.gameplayService.waveToPlayer(
        user.userId,
        targetUserId,
        isWaveBack,
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('takeitem')
  async takeitem(@User() user) {
    if (await this.inventoryService.isInventoryFull(user.userId)) {
      throw new BadRequestException('Inventory is full.');
    }

    return {
      player: await this.gameplayService.takeItem(user.userId),
    };
  }
}
