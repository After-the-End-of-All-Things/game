import { Component, OnInit } from '@angular/core';
import { ChooseAvatarModalComponent } from '@components/modals/choose-avatar/choose-avatar.component';
import { IPlayer } from '@interfaces';
import { ModalController } from '@ionic/angular';
import { Select } from '@ngxs/store';
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

  constructor(
    private modal: ModalController,
    private playerService: PlayerService,
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
