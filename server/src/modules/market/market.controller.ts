import { IFullUser, IMarketItem, IPagination, IPatchUser } from '@interfaces';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { MarketService } from '@modules/market/market.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '@utils/user.decorator';

@ApiBearerAuth()
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a filtered item list from the market' })
  @Get('items')
  async getItems(
    @User() user,
    @Query() query: any,
  ): Promise<IPagination<IMarketItem>> {
    return this.marketService.getItems(user.userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the current users listings' })
  @Get('listings')
  async getMyListings(@User() user): Promise<IPagination<IMarketItem>> {
    return this.marketService.getMyListings(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List an item for sale' })
  @Put('listings')
  async listItemForSale(
    @User() user,
    @Body('instanceId') instanceId: string,
    @Body('price') price: number,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.marketService.listItem(user.userId, instanceId, price);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update the listing price for an item' })
  @Patch('listings/:id')
  async updateListingPrice(
    @User() user,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove the listing for an item' })
  @Post('listings/:id/unsell')
  async removeListing(@User() user): Promise<Partial<IFullUser | IPatchUser>> {
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buy the listing for an item' })
  @Post('listings/:id/buy')
  async buyListing(
    @User() user,
    @Param('id') listingId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return this.marketService.buyItem(user.userId, listingId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Claim the listing value for an item post-sell' })
  @Post('listings/:id/claim')
  async claimListingValue(
    @User() user,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    return {};
  }
}
