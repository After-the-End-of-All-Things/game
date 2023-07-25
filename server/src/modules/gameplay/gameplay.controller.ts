import { IFullUser, IPatchUser, ItemSlot } from '@interfaces';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { GameplayService } from '@modules/gameplay/gameplay.service';
import { InventoryService } from '@modules/inventory/inventory.service';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Put,
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
  async explore(@User() user): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.explore(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Set a walking path to a new location' })
  @Post('walk')
  async walk(
    @User() user,
    @Body('location') location: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.walkToLocation(user.userId, location);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Travel immediately to a new location' })
  @Post('travel')
  async travel(
    @User() user,
    @Body('location') location: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.travelToLocation(user.userId, location);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Explore Event: Wave at another player' })
  @Post('wave')
  async wave(@User() user): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.waveToPlayerFromExplore(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Explore Event: Wave at another player' })
  @Post('wave/:id')
  async waveFromNotification(
    @User() user,
    @Param('id') notificationId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.waveToPlayerFromNotification(
      user.userId,
      notificationId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Explore Event: Take an item' })
  @Post('item/take')
  async takeItem(@User() user): Promise<Partial<IFullUser | IPatchUser>> {
    if (await this.inventoryService.isInventoryFull(user.userId)) {
      throw new BadRequestException('Inventory is full.');
    }

    return this.gameplayService.takeItem(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Sell an item' })
  @Post('item/sell')
  async sellItem(
    @User() user,
    @Body('instanceId') instanceId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.sellItem(user.userId, instanceId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Equip an item' })
  @Patch('item/equip/:slot')
  async equipItem(
    @User() user,
    @Param('slot') equipmentSlot: ItemSlot,
    @Body('instanceId') instanceId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.equipItem(
      user.userId,
      equipmentSlot,
      instanceId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Craft an item' })
  @Put('item/craft/start')
  async craftItem(
    @User() user,
    @Body('itemId') itemId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.craftItem(user.userId, itemId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Take a crafted item' })
  @Post('item/craft/take')
  async takeCraftItem(@User() user): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.takeCraftedItem(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Take a crafted item (from notification)' })
  @Post('item/craft/take/:id')
  async takeCraftItemFromNotification(
    @User() user,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.gameplayService.takeCraftedItem(user.userId);
  }
}
