import { UserResponse } from '@interfaces';
import { JwtAuthGuard } from '@modules/auth/jwt.guard';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '@utils/user.decorator';

@ApiBearerAuth()
@Controller('player')
export class PlayerController {
  constructor(
    private readonly discoveriesService: DiscoveriesService,
    private readonly playerService: PlayerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Specific Player Profile' })
  @Get('profile/:id')
  async getPlayerProfile(
    @Param('id') id: string,
  ): Promise<Partial<Player> | undefined> {
    return this.playerService.getPlayerProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Player Tagline' })
  @Patch('profile/shortbio')
  async changeShortBio(
    @User() user,
    @Body('shortbio') shortbio: string,
  ): Promise<UserResponse> {
    return this.playerService.updateShortBioForPlayer(user.userId, shortbio);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Player Bio' })
  @Patch('profile/longbio')
  async changeLongBio(
    @User() user,
    @Body('longbio') longbio: string,
  ): Promise<UserResponse> {
    return this.playerService.updateLongBioForPlayer(user.userId, longbio);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Player Portrait' })
  @Patch('cosmetics/portrait')
  async changePortrait(
    @User() user,
    @Body('portrait') portrait: number,
  ): Promise<UserResponse> {
    const portraitId = Math.round(Math.min(106, Math.max(0, portrait)));

    // Fetch the player's discoveries
    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      user.userId,
    );

    if (!discoveries) {
      throw new NotFoundException('Discoveries not found for this user.');
    }

    // Check if the portrait is unlocked
    if (!discoveries.portraits[portraitId.toString()]) {
      throw new NotFoundException(`Portrait ${portraitId} is not unlocked.`);
    }

    return this.playerService.updatePortraitForPlayer(user.userId, portraitId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Player Background' })
  @Patch('cosmetics/background')
  async changeBackground(
    @User() user,
    @Body('background') background: number,
  ): Promise<UserResponse> {
    const backgroundId = Math.round(Math.min(18, Math.max(-1, background)));

    // Fetch the player's discoveries
    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      user.userId,
    );

    if (!discoveries) {
      throw new NotFoundException('Discoveries not found for this user.');
    }

    // Check if the portrait is unlocked
    if (backgroundId !== -1 && !discoveries.backgrounds[backgroundId]) {
      throw new NotFoundException(
        `Background ${backgroundId} is not unlocked.`,
      );
    }

    return this.playerService.updateBackgroundForPlayer(
      user.userId,
      backgroundId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Player Showcase Collectible/Slot' })
  @Patch('showcase/collectible')
  async changeShowcaseCollectible(
    @User() user,
    @Body('itemId') itemId: string,
    @Body('slot') slot: number,
  ): Promise<UserResponse> {
    return this.playerService.updateShowcaseCollectibles(
      user.userId,
      itemId,
      slot,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Player Showcase Item/Slot' })
  @Patch('showcase/item')
  async changeShowcaseItem(
    @User() user,
    @Body('itemId') itemId: string,
    @Body('slot') slot: number,
  ): Promise<UserResponse> {
    return this.playerService.updateShowcaseItems(user.userId, itemId, slot);
  }
}
