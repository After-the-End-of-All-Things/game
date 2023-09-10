import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { LeaderboardService } from '@modules/leaderboard/leaderboard.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a local locations leaderboard' })
  @Get('local')
  async localLeaderboard(@Query('location') location: string): Promise<any> {
    return this.leaderboardService.getLeaderboard(location);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the global leaderboard' })
  @Get('global')
  async globalLeaderboard(): Promise<any> {
    return this.leaderboardService.getLeaderboard();
  }
}
