import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input({ required: true }) spritesheet!: string;
  @Input({ required: true }) sprite!: number;
  @Input() quality = 'medium';
  @Input() scale = 1;

  public spritesheetUrl!: any;
  public assetLocation = '-0px -0px';

  constructor(private imageService: ImageService) {}

  async ngOnInit() {
    this.spritesheetUrl = await this.imageService.getImageUrl(
      this.spritesheet,
      this.quality,
    );

    this.assetLocation = this.getSpriteLocation();
  }

  async ngOnChanges() {
    this.spritesheetUrl = await this.imageService.getImageUrl(
      this.spritesheet,
      this.quality,
    );

    this.assetLocation = this.getSpriteLocation();
  }

  private getSpriteLocation() {
    const divisor = 16;
    const realSprite = this.sprite - 1;
    const y = Math.floor(realSprite / divisor);
    const x = realSprite % divisor;
    return `-${x * 64}px -${y * 64}px`;
  }
}
