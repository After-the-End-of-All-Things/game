import { ItemSlot, UserResponse } from '@interfaces';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { GameplayService } from '@modules/gameplay/gameplay.service';
import { ItemService } from '@modules/gameplay/item.service';
import { NpcService } from '@modules/gameplay/npc.service';
import { TravelService } from '@modules/gameplay/travel.service';
import { WaveService } from '@modules/gameplay/wave.service';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { isProduction } from '@utils/isprod';
import { User } from '@utils/user.decorator';

@ApiBearerAuth()
@Throttle({ default: { limit: isProduction() ? 1 : 100, ttl: 1000 } })
@Controller('gameplay')
export class GameplayController {
  constructor(
    private gameplayService: GameplayService,
    private travelService: TravelService,
    private waveService: WaveService,
    private itemService: ItemService,
    private npcService: NpcService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Explore the current location' })
  @Post('explore')
  async explore(@User() user): Promise<UserResponse> {
    return this.gameplayService.explore(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Set a walking path to a new location' })
  @Post('walk')
  async walk(
    @User() user,
    @Body('location') location: string,
  ): Promise<UserResponse> {
    return this.travelService.walkToLocation(user.userId, location);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Travel immediately to a new location' })
  @Post('travel')
  async travel(
    @User() user,
    @Body('location') location: string,
  ): Promise<UserResponse> {
    return this.travelService.travelToLocation(user.userId, location);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Explore Event: Wave at another player' })
  @Post('wave')
  async wave(@User() user): Promise<UserResponse> {
    return this.waveService.waveToPlayerFromExplore(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Explore Event: Wave at another player' })
  @Post('wave/:id')
  async waveFromNotification(
    @User() user,
    @Param('id') notificationId: string,
  ): Promise<UserResponse> {
    return this.waveService.waveToPlayerFromNotification(
      user.userId,
      notificationId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Explore Event: Take an item' })
  @Post('item/take')
  async takeItem(@User() user): Promise<UserResponse> {
    return this.itemService.takeItem(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Explore Event: Fight monsters' })
  @Post('fight')
  async fight(@User() user): Promise<UserResponse> {
    return this.gameplayService.startFight(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Sell an item' })
  @Post('item/sell')
  async sellItem(
    @User() user,
    @Body('instanceId') instanceId: string,
  ): Promise<UserResponse> {
    return this.itemService.sellItem(user.userId, instanceId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Equip an item' })
  @Patch('item/equip/:slot')
  async equipItem(
    @User() user,
    @Param('slot') equipmentSlot: ItemSlot,
    @Body('instanceId') instanceId: string,
  ): Promise<UserResponse> {
    return this.itemService.equipItem(user.userId, equipmentSlot, instanceId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Unequip an item' })
  @Patch('item/unequip/:slot')
  async unequipItem(
    @User() user,
    @Param('slot') equipmentSlot: ItemSlot,
    @Body('instanceId') instanceId: string,
  ): Promise<UserResponse> {
    return this.itemService.unequipItem(user.userId, equipmentSlot, instanceId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Craft an item' })
  @Put('item/craft/start')
  async craftItem(
    @User() user,
    @Body('itemId') itemId: string,
  ): Promise<UserResponse> {
    return this.itemService.craftItem(user.userId, itemId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Take a crafted item' })
  @Post('item/craft/take')
  async takeCraftItem(@User() user): Promise<UserResponse> {
    return this.itemService.takeCraftedItem(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Take a crafted item (from notification)' })
  @Post('item/craft/take/:id')
  async takeCraftItemFromNotification(@User() user): Promise<UserResponse> {
    return this.itemService.takeCraftedItem(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change classes' })
  @Post('changeclass')
  async changeClass(@User() user): Promise<UserResponse> {
    return this.npcService.changeClass(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buy a background' })
  @Post('unlockbackground')
  async buyBackground(@User() user): Promise<UserResponse> {
    return this.npcService.buyBackground(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buy a portrait' })
  @Post('unlocksprite')
  async buyPortrait(@User() user): Promise<UserResponse> {
    return this.npcService.buyPortrait(user.userId);
  }
}
