import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  constructor(private imageService: ImageService) {}

  async init() {
    const manifest = await fetch(`${environment.assetsUrl}/manifest.json`);
    const manifestData = await manifest.json();

    manifestData.assets.spritesheetMQ.forEach((asset: any) => {
      const fullUrl = `${environment.assetsUrl}/${asset.path}`;
      this.imageService.fetchImage(fullUrl).subscribe((blob) => {
        this.imageService.saveImageToDatabase(
          asset.name,
          asset.hash,
          'medium',
          fullUrl,
          blob
        );
      });
    });
  }
}
