import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContentService } from '@services/content.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-choose-background',
  templateUrl: './choose-background.component.html',
  styleUrls: ['./choose-background.component.scss'],
})
export class ChooseBackgroundComponent implements OnInit {
  @Input() defaultBackground!: number;
  @Input() selectedBackground!: number;

  public selectableBackgrounds: number[] = [];

  public readonly allBackgrounds = Array(this.contentService.maxBackgrounds)
    .fill(0)
    .map((_, i) => i);

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService,
    private contentService: ContentService,
  ) {}

  ngOnInit() {
    this.userService.getDiscoveries().subscribe(({ discoveries }: any) => {
      const backgrounds = discoveries.backgrounds || {};
      this.selectableBackgrounds = Object.keys(backgrounds).map((x) => +x);
    });

    this.selectedBackground = this.defaultBackground;
  }

  selectBackground(background: number) {
    this.selectedBackground = background;
  }

  confirm() {
    if (this.defaultBackground === this.selectedBackground) {
      this.modalCtrl.dismiss();
      return;
    }

    this.modalCtrl.dismiss(this.selectedBackground);
  }

  reset() {
    this.modalCtrl.dismiss('reset');
  }
}
