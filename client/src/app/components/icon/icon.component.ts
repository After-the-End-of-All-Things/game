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

  public spritesheetUrl!: any;

  get assetLocation() {
    const divisor = 16;
    const y = Math.floor(this.sprite / divisor);
    const x = this.sprite % divisor;
    return `-${x * 64}px -${y * 64}px`;
  }

  constructor(private imageService: ImageService) {}

  async ngOnInit() {
    this.spritesheetUrl = await this.imageService.getImageUrl(
      this.spritesheet,
      this.quality
    );
    console.log(this.spritesheetUrl);
  }
}
