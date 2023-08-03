import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MarketModalComponent } from '@components/modals/market/market.component';
import { ILocation, IPlayer } from '@interfaces';
import { ModalController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { PlayerStore } from '@stores';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-town',
  templateUrl: './town.page.html',
  styleUrls: ['./town.page.scss'],
})
export class TownPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  public locationInfo: ILocation | undefined;

  @Select(PlayerStore.player) player$!: Observable<IPlayer>;

  constructor(
    private contentService: ContentService,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.player$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((player) => {
        this.locationInfo = this.contentService.getLocation(
          player.location.current,
        );
      });
  }

  async openMarket() {
    const modal = await this.modalCtrl.create({
      cssClass: 'market-modal',
      component: MarketModalComponent,
    });

    return await modal.present();
  }
}
