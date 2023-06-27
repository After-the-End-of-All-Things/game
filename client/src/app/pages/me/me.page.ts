import { Component, OnInit } from '@angular/core';
import { ChooseAvatarModalComponent } from '@components/modals/choose-avatar/choose-avatar.component';
import { IEquipment, IPlayer, ItemSlot, Stat } from '@interfaces';
import { ModalController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { AuthService } from '@services/auth.service';
import { ContentService } from '@services/content.service';
import { PlayerService } from '@services/player.service';
import { InventoryStore, PlayerStore } from '@stores';
import { sum } from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;
  @Select(InventoryStore.equipped) equipment$!: Observable<
    Record<ItemSlot, IEquipment>
  >;

  public readonly stats = [
    {
      name: 'HP',
      stat: Stat.Health,
    },
    {
      name: 'Power',
      stat: Stat.Power,
    },
    {
      name: 'Toughness',
      stat: Stat.Toughness,
    },
    {
      name: 'Special',
      stat: Stat.Special,
    },
    {
      name: 'Magic',
      stat: Stat.Magic,
    },
    {
      name: 'Resistance',
      stat: Stat.Resistance,
    },
  ];

  constructor(
    private modal: ModalController,
    private contentService: ContentService,
    private playerService: PlayerService,
    public authService: AuthService,
  ) {}

  ngOnInit() {}

  async changePortrait(defaultPortrait: number) {
    const modal = await this.modal.create({
      component: ChooseAvatarModalComponent,
      componentProps: {
        defaultPortrait,
      },
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.playerService.changePortrait(data);
    }
  }

  calcStat(
    player: IPlayer,
    equipment: Record<ItemSlot, IEquipment>,
    stat: Stat,
  ) {
    const job = this.contentService.getJob(player.job);
    if (!job) return 0;

    const total = sum(
      Object.values(equipment)
        .filter(Boolean)
        .map((item) => item.stats[stat] ?? 0),
    );

    return total + Math.floor(job.statGainsPerLevel[stat] * player.level);
  }

  getMainNumber(value: number) {
    return Math.floor(value);
  }

  getSubNumber(value: number) {
    return (value - Math.floor(value)).toFixed(1).substring(1);
  }
}
