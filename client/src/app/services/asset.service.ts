import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private maxPortraits = 0;
  private maxBackgrounds = 0;

  public get portraitCount(): number {
    return this.maxPortraits;
  }

  public get backgroundCount(): number {
    return this.maxBackgrounds;
  }

  constructor(private imageService: ImageService) {}

  async init() {
    const manifest = await fetch(`${environment.assetsUrl}/manifest.json`);
    const manifestData = await manifest.json();

    this.maxPortraits = manifestData.assets.individualLQ.filter((x: any) =>
      x.name.startsWith('portraits-'),
    ).length;

    this.maxBackgrounds = manifestData.assets.backgrounds.length;

    manifestData.assets.spritesheetMQ.forEach((asset: any) => {
      const fullUrl = `${environment.assetsUrl}/${asset.path}`;
      this.imageService.fetchImage(fullUrl).subscribe((blob) => {
        this.imageService.saveImageToDatabase(
          asset.name,
          asset.hash,
          'medium',
          fullUrl,
          blob,
        );
      });
    });
  }
}
