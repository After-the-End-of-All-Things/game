import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss'],
})
export class ChooseAvatarModalComponent implements OnInit {
  @Input() defaultPortrait!: number;
  @Input() selectedPortrait!: number;

  public readonly defaultSelectablePortraits = [
    1, 2, 4, 5, 6, 16, 17, 18, 50, 64, 101,
  ];

  public readonly allPortraits = Array(107)
    .fill(0)
    .map((_, i) => i);

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.selectedPortrait = this.defaultPortrait;
  }

  selectPortrait(portrait: number) {
    this.selectedPortrait = portrait;
  }

  confirm() {
    if (this.defaultPortrait === this.selectedPortrait) {
      this.modalCtrl.dismiss();
      return;
    }

    this.modalCtrl.dismiss(this.selectedPortrait);
  }
}
