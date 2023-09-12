import {
  Component,
  DestroyRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Select } from '@ngxs/store';
import { AssetService } from '@services/asset.service';
import { OptionsStore } from '@stores';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit, OnChanges {
  private destroyRef = inject(DestroyRef);

  @Select(OptionsStore.quality) quality$!: Observable<string>;

  @Input({ required: true }) spritesheet!: string;
  @Input({ required: true }) sprite!: number;
  @Input() size: 'xsmall' | 'small' | 'normal' = 'normal';
  @Input() active = false;

  @HostBinding('class') get sizeClass() {
    return this.size;
  }

  private hasLoaded = false;
  private quality = 'medium';

  public spritesheetUrl!: any;
  public assetLocation = '-0px -0px';

  constructor(private assetService: AssetService) {}

  async ngOnInit() {
    this.quality$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        this.quality = res;
        this.updateSprite();
        this.hasLoaded = true;
      });
  }

  async ngOnChanges() {
    if (!this.hasLoaded) return;
    this.updateSprite();
  }

  private async updateSprite() {
    this.spritesheetUrl = this.assetService.getSpritesheetUrl(
      this.spritesheet,
      this.quality,
    );
    this.assetLocation = this.getSpriteLocation();
  }

  private getSpriteLocation() {
    const divisor = 16;
    const realSprite = this.sprite;
    const y = Math.floor(realSprite / divisor);
    const x = realSprite % divisor;
    return `-${x * 64}px -${y * 64}px`;
  }
}
