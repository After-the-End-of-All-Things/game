import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { InventoryService } from '@modules/inventory/inventory.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@utils/user.decorator';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('items')
  async getItems(@User() user) {
    return {
      items: await this.inventoryService.getInventoryItemsForUser(user.userId),
    };
  }
}
