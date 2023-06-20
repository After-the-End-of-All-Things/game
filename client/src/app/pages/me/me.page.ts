import { Component, OnInit } from '@angular/core';
import { ChooseAvatarModalComponent } from '@components/modals/choose-avatar/choose-avatar.component';
import { IPlayer, Stat } from '@interfaces';
import { ModalController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { AuthService } from '@services/auth.service';
import { ContentService } from '@services/content.service';
import { PlayerService } from '@services/player.service';
import { PlayerStore } from '@stores';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;

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

  calcStat(player: IPlayer, stat: Stat) {
    const job = this.contentService.getJob(player.job);
    if (!job) return 0;

    return Math.floor(job.statGainsPerLevel[stat] * player.level);
  }
}
