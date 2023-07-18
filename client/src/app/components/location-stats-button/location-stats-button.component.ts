import { Component, Input, OnInit } from '@angular/core';
import { LocationStatsModalComponent } from '@components/modals/location-stats/location-stats.component';
import { ModalController } from '@ionic/angular';
import { ContentService } from '@services/content.service';

@Component({
  selector: 'app-location-stats-button',
  templateUrl: './location-stats-button.component.html',
  styleUrls: ['./location-stats-button.component.scss'],
})
export class LocationStatsButtonComponent implements OnInit {
  @Input({ required: true }) location!: string;

  constructor(
    private modalCtrl: ModalController,
    private contentService: ContentService,
  ) {}

  ngOnInit() {}

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: LocationStatsModalComponent,
      componentProps: {
        location: this.contentService.getLocation(this.location),
      },
    });
    await modal.present();
  }
}
