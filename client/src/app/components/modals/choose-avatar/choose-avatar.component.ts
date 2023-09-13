import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContentService } from '@services/content.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss'],
})
export class ChooseAvatarModalComponent implements OnInit {
  @Input() defaultPortrait!: number;
  @Input() selectedPortrait!: number;

  public selectablePortraits: number[] = [];

  public readonly allPortraits = Array(this.contentService.maxPortraits)
    .fill(0)
    .map((_, i) => i);

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService,
    private contentService: ContentService,
  ) {}

  ngOnInit() {
    this.userService.getDiscoveries().subscribe(({ discoveries }: any) => {
      const portraits = discoveries.portraits || {};
      this.selectablePortraits = Object.keys(portraits).map((x) => +x);
    });

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
