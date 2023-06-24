import { IFullUser, IPatchUser } from '@interfaces';
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
import { RollbarHandler } from 'nestjs-rollbar';

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
  @RollbarHandler()
  async explore(@User() user): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.explore(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Set a walking path to a new location' })
  @Post('walk')
  @RollbarHandler()
  async walk(
    @User() user,
    @Body('location') location: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.walkToLocation(user.userId, location);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Travel immediately to a new location' })
  @Post('travel')
  @RollbarHandler()
  async travel(
    @User() user,
    @Body('location') location: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.travelToLocation(user.userId, location);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Explore Event: Wave at another player' })
  @Post('wave')
  @RollbarHandler()
  async wave(
    @User() user,
    @Body('targetUserId') targetUserId: string,
    @Body('isWaveBack') isWaveBack: boolean,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.waveToPlayer(
      user.userId,
      targetUserId,
      isWaveBack,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Explore Event: Take an item' })
  @Post('takeitem')
  @RollbarHandler()
  async takeItem(@User() user): Promise<Partial<IFullUser | IPatchUser>> {
    if (await this.inventoryService.isInventoryFull(user.userId)) {
      throw new BadRequestException('Inventory is full.');
    }

    return this.gameplayService.takeItem(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Sell an item' })
  @Post('sellitem')
  @RollbarHandler()
  async sellItem(
    @User() user,
    @Body('instanceId') instanceId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.sellItem(user.userId, instanceId);
  }
}
