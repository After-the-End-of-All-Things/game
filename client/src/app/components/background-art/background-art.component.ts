import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AssetService } from '@services/asset.service';

@Component({
  selector: 'app-background-art',
  templateUrl: './background-art.component.html',
  styleUrls: ['./background-art.component.scss'],
})
export class BackgroundArtComponent implements OnInit, OnChanges {
  @Input({ required: true }) sprite!: string;

  public bgUrl: any;

  constructor(private assetService: AssetService) {}

  async ngOnInit() {
    this.bgUrl = await this.assetService.getBackgroundUrl(this.sprite);
  }

  async ngOnChanges() {
    this.bgUrl = await this.assetService.getBackgroundUrl(this.sprite);
  }
}
