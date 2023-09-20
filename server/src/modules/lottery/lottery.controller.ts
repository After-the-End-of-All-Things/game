import { UserResponse } from '@interfaces';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { BuyInLotteryService } from '@modules/lottery/buyinlottery.service';
import { DailyLotteryService } from '@modules/lottery/dailylottery.service';
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { User } from '@utils/user.decorator';

@SkipThrottle()
@Controller('lottery')
@ApiBearerAuth()
export class LotteryController {
  constructor(
    private dailyLotteryService: DailyLotteryService,
    private buyinLotteryService: BuyInLotteryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if I won the daily lottery today' })
  @Get('daily/didiwintoday')
  async didIWinToday(@User() user): Promise<boolean> {
    return this.dailyLotteryService.isWinnerToday(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Claim daily lottery rewards' })
  @Post('daily/claim')
  async claimDailyRewards(@User() user): Promise<UserResponse> {
    return this.dailyLotteryService.claimRewards(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my buyin tickets total value' })
  @Get('buyin/value')
  async jackpotValue(): Promise<number> {
    return this.buyinLotteryService.ticketValueSum();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my buyin ticket numbers' })
  @Get('buyin/tickets')
  async viewTickets(@User() user): Promise<string[]> {
    return this.buyinLotteryService.ticketNumbers(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buy a buyin ticket' })
  @Post('buyin/tickets')
  async buyBuyinTickets(@User() user): Promise<UserResponse> {
    return this.buyinLotteryService.buyTicket(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if I won the buyin lottery today' })
  @Get('buyin/didiwintoday')
  async didIWinBuyInToday(@User() user): Promise<boolean> {
    return this.buyinLotteryService.isWinnerToday(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Claim buyin lottery rewards' })
  @Post('buyin/claim')
  async claimBuyinRewards(@User() user): Promise<UserResponse> {
    return this.buyinLotteryService.claimTicket(user.userId);
  }
}
