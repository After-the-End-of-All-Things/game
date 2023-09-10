import { ILocation, ILocationNPC, INotificationAction } from '@interfaces';
import { DiscoveriesService } from '@modules/discoveries/discoveries.service';
import { Player } from '@modules/player/player.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NpcService {
  constructor(private readonly discoveriesService: DiscoveriesService) {}

  async getActionForNPC(
    player: Player,
    location: ILocation,
    npc: ILocationNPC,
  ): Promise<INotificationAction | undefined> {
    switch (npc.type) {
      case 'ClassTrainer': {
        return this.encounterClassTrainer(player, location, npc);
      }

      case 'SpriteUnlocker': {
        return this.encounterSpriteUnlocker(player, location, npc);
      }

      case 'BackgroundUnlocker': {
        return this.encounterBackgroundUnlocker(player, location, npc);
      }

      default: {
        return npc.type satisfies never;
      }
    }
  }

  async encounterSpriteUnlocker(
    player: Player,
    location: ILocation,
    npc: ILocationNPC,
  ): Promise<INotificationAction | undefined> {
    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      player.userId,
    );
    if (!discoveries) return undefined;
    if (discoveries.portraits[npc.properties.unlockSprite]) return undefined;

    return {
      text: 'Buy',
      action: 'buysprite',
      actionData: {
        npc,
      },
      url: 'gameplay/unlocksprite',
      urlData: {},
    };
  }

  async encounterBackgroundUnlocker(
    player: Player,
    location: ILocation,
    npc: ILocationNPC,
  ): Promise<INotificationAction | undefined> {
    const discoveries = await this.discoveriesService.getDiscoveriesForUser(
      player.userId,
    );
    if (!discoveries) return undefined;
    if (discoveries.backgrounds[npc.properties.unlockBackground])
      return undefined;

    return {
      text: 'Buy',
      action: 'buybackground',
      actionData: {
        npc,
      },
      url: 'gameplay/unlockbackground',
      urlData: {},
    };
  }

  encounterClassTrainer(
    player: Player,
    location: ILocation,
    npc: ILocationNPC,
  ): INotificationAction | undefined {
    if (player.job === npc.properties.changeJob) return undefined;

    return {
      text: 'Change',
      action: 'change',
      actionData: {
        newJob: npc.properties.changeJob,
        npc,
      },
      url: 'gameplay/changeclass',
      urlData: {},
    };
  }
}
