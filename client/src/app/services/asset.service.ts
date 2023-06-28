import { Injectable } from '@angular/core';
import { BackgroundImageService } from '@services/backgroundimage.service';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private maxPortraits = 0;
  private maxBackgrounds = 0;

  private backgroundUrls: Record<string, string> = {};
  private spritesheetUrlsByQuality: Record<string, Record<string, string>> = {};

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

    await Promise.all(
      manifestData.assets.backgrounds.map(async ({ name, path, hash }: any) => {
        const fullUrl = `${environment.assetsUrl}/${path}`;

        const oldImage = await this.backgroundImageService.getImageDataById(
          name,
        );

        if (!oldImage || oldImage.hash !== hash) {
          const blob = await lastValueFrom(
            this.imageService.fetchImage(fullUrl),
          );

          this.backgroundImageService.saveImageToDatabase(
            name,
            hash,
            fullUrl,
            blob,
          );
        }

        const url = await this.backgroundImageService.getSafeImageUrl(name);
        this.backgroundUrls[name] = url;
      }),
    );

    const qualitiesAndSheets = [
      { quality: 'minimal', sheets: manifestData.assets.spritesheetPQ },
      { quality: 'low', sheets: manifestData.assets.spritesheetLQ },
      { quality: 'medium', sheets: manifestData.assets.spritesheetMQ },
      { quality: 'high', sheets: manifestData.assets.spritesheetHQ },
    ];

    await Promise.all(
      qualitiesAndSheets.map(async ({ quality, sheets }) => {
        await Promise.all(
          sheets.map(async ({ name, path, hash }: any) => {
            const fullUrl = `${environment.assetsUrl}/${path}`;

            this.spritesheetUrlsByQuality[quality] = {};

            const oldImage = await this.imageService.getImageDataByUrl(fullUrl);

            if (!oldImage || oldImage.hash !== hash) {
              const blob = await lastValueFrom(
                this.imageService.fetchImage(fullUrl),
              );

              await this.imageService.saveImageToDatabase(
                name,
                hash,
                quality,
                fullUrl,
                blob,
              );
            }

            const url = await this.imageService.getSafeImageUrl(name, quality);
            this.spritesheetUrlsByQuality[quality][name] = url;
          }),
        );
      }),
    );
  }

  public getSpritesheetUrl(name: string, quality: string): string {
    return this.spritesheetUrlsByQuality[quality][name];
  }

  public getBackgroundUrl(name: string): string {
    return this.backgroundUrls[name];
  }
}
