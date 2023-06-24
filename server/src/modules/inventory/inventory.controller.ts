import { IFullUser, IPatchUser } from '@interfaces';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { InventoryService } from '@modules/inventory/inventory.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '@utils/user.decorator';

@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my current item list' })
  @Get('items')
  async getItems(@User() user): Promise<Partial<IFullUser | IPatchUser>> {
    return this.inventoryService.getInventoryItemsForUser(user.userId);
  }
}
