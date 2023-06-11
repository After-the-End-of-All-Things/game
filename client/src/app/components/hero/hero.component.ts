import { Component, OnInit } from '@angular/core';
import { ChooseAvatarModalComponent } from '@components/modals/choose-avatar/choose-avatar.component';
import { IPlayer, IUser } from '@interfaces';
import { ModalController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { PlayerService } from '@services/player.service';
import { PlayerStore, UserStore } from '@stores';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  @Select(UserStore.user) user$!: Observable<IUser>;
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;

  constructor(
    private modal: ModalController,
    private playerService: PlayerService
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
}
