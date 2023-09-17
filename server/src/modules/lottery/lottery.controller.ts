import { UserResponse } from '@interfaces';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { LotteryService } from '@modules/lottery/lottery.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '@utils/user.decorator';

@Controller('lottery')
@ApiBearerAuth()
export class LotteryController {
  constructor(private lotteryService: LotteryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if I won the lottery today' })
  @Get('didiwintoday')
  async didIWinToday(@User() user): Promise<boolean> {
    return this.lotteryService.isWinnerToday(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if I won the lottery today' })
  @Get('claimdailyrewards')
  async claimDailyRewards(@User() user): Promise<UserResponse> {
    return this.lotteryService.claimDailyRewards(user.userId);
  }
}
