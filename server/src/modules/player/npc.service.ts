import { ILocation, ILocationNPC, INotificationAction } from '@interfaces';
import { Player } from '@modules/player/player.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NpcService {
  getActionForNPC(
    player: Player,
    location: ILocation,
    npc: ILocationNPC,
  ): INotificationAction | undefined {
    switch (npc.type) {
      case 'ClassTrainer': {
        return this.encounterClassTrainer(player, location, npc);
      }

      default: {
        return npc.type satisfies never;
      }
    }
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
