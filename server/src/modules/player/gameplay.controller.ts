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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '@utils/user.decorator';

@ApiBearerAuth()
@Controller('gameplay')
export class GameplayController {
  constructor(
    private gameplayService: GameplayService,
    private inventoryService: InventoryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Explore the current location' })
  @Post('explore')
  async explore(@User() user) {
    return this.gameplayService.explore(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Set a walking path to a new location' })
  @Post('walk')
  async walk(@User() user, @Body('location') location: string) {
    return {
      player: await this.gameplayService.walkToLocation(user.userId, location),
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Travel immediately to a new location' })
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
  @ApiOperation({ summary: 'Explore Event: Wave at another player' })
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
  @ApiOperation({ summary: 'Explore Event: Take an item' })
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
