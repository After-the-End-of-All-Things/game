import { Injectable } from '@angular/core';
import { BackgroundImageService } from '@services/backgroundimage.service';
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

  constructor(
    private imageService: ImageService,
    private backgroundImageService: BackgroundImageService,
  ) {}

  async init() {
    const manifest = await fetch(`${environment.assetsUrl}/manifest.json`);
    const manifestData = await manifest.json();

    this.maxPortraits = manifestData.assets.individualLQ.filter((x: any) =>
      x.name.startsWith('portraits-'),
    ).length;

    this.maxBackgrounds = manifestData.assets.backgrounds.length;

    manifestData.assets.backgrounds.forEach(
      async ({ name, path, hash }: any) => {
        const fullUrl = `${environment.assetsUrl}/${path}`;

        const oldImage = await this.backgroundImageService.getImageDataById(
          name,
        );

        if (!oldImage || oldImage.hash !== hash) {
          this.backgroundImageService.fetchImage(fullUrl).subscribe((blob) => {
            this.backgroundImageService.saveImageToDatabase(
              name,
              hash,
              fullUrl,
              blob,
            );
          });
        }
      },
    );

    const qualitiesAndSheets = [
      { quality: 'minimal', sheets: manifestData.assets.spritesheetPQ },
      { quality: 'low', sheets: manifestData.assets.spritesheetLQ },
      { quality: 'medium', sheets: manifestData.assets.spritesheetMQ },
      { quality: 'high', sheets: manifestData.assets.spritesheetHQ },
    ];

    qualitiesAndSheets.forEach(({ quality, sheets }) => {
      sheets.forEach(async ({ name, path, hash }: any) => {
        const fullUrl = `${environment.assetsUrl}/${path}`;

        const oldImage = await this.imageService.getImageDataByUrl(fullUrl);

        if (!oldImage || oldImage.hash !== hash) {
          this.imageService.fetchImage(fullUrl).subscribe((blob) => {
            this.imageService.saveImageToDatabase(
              name,
              hash,
              quality,
              fullUrl,
              blob,
            );
          });
        }
      });
    });
  }
}
