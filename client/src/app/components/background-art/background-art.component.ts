import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BackgroundImageService } from '@services/backgroundimage.service';

@Component({
  selector: 'app-background-art',
  templateUrl: './background-art.component.html',
  styleUrls: ['./background-art.component.scss'],
})
export class BackgroundArtComponent implements OnInit, OnChanges {
  @Input({ required: true }) sprite!: string;

  public bgUrl: any;

  constructor(private backgroundImageService: BackgroundImageService) {}

  async ngOnInit() {
    this.bgUrl = await this.backgroundImageService.getSafeImageUrl(this.sprite);
  }

  async ngOnChanges() {
    this.bgUrl = await this.backgroundImageService.getSafeImageUrl(this.sprite);
  }
}
