import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AssetService } from '@services/asset.service';

@Component({
  selector: 'app-background-art',
  templateUrl: './background-art.component.html',
  styleUrls: ['./background-art.component.scss'],
})
export class BackgroundArtComponent implements OnInit, OnChanges {
  @Input({ required: true }) sprite!: number;

  public bgUrl: any;

  public get backgroundSprite() {
    return this.sprite.toString().padStart(4, '0');
  }

  constructor(private assetService: AssetService) {}

  async ngOnInit() {
    this.updateImage();
  }

  async ngOnChanges() {
    this.updateImage();
  }

  private async updateImage() {
    if (this.sprite === -1) return;

    this.bgUrl = await this.assetService.getBackgroundUrl(
      this.backgroundSprite,
    );
  }
}
