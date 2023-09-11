import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { Stats } from '@modules/stats/stats.schema';
import { StatsService } from '@modules/stats/stats.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Specific Player Stats' })
  @Get(':id')
  async getPlayerStats(@Param('id') id: string): Promise<Stats | undefined> {
    return this.statsService.getStatsForUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Specific Player Leaderboard Stats' })
  @Get(':id/leaderboard')
  async getPlayerLeaderboardStats(
    @Param('id') id: string,
  ): Promise<Array<{ name: string; value: string }> | undefined> {
    return this.statsService.getLeaderboardStatsForUser(id);
  }
}
