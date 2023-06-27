import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import {
  BackgroundBlobImage,
  createBackgroundImage,
  readBackgroundImageByID,
  readBackgroundImagesByURL,
} from '@services/backgroundimage.db';

@Injectable({
  providedIn: 'root',
})
export class BackgroundImageService {
  constructor(
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
  ) {}

  async getCSSBackgroundImageURL(url: string) {
    let images: BackgroundBlobImage[] = await readBackgroundImagesByURL(url);
    if (images.length == 0) {
      return `url('${url}')`;
    }

    const safeURL: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(images[0].data),
    );

    return this.getSafeBackgroundImageUrl(safeURL);
  }

  private getSafeBackgroundImageUrl(url: any) {
    return `url("${url.changingThisBreaksApplicationSecurity}")`;
  }

  async getImageData(id: string) {
    return readBackgroundImageByID(id);
  }

  async getImageUrl(id: string) {
    const blob = await readBackgroundImageByID(id);
    if (!blob) {
      return '';
    }

    const safeURL: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(blob.data),
    );

    return safeURL;
  }

  async getSafeImageUrl(id: string) {
    const baseUrl = await this.getImageUrl(id);
    return (baseUrl as any).changingThisBreaksApplicationSecurity;
  }

  fetchImage(url: string): Observable<Blob> {
    return this.httpClient.get(url, {
      responseType: 'blob',
    });
  }

  async saveImageToDatabase(
    name: string,
    hash: string,
    url: string,
    blob: Blob,
  ) {
    if ((await readBackgroundImagesByURL(url)).length === 0) {
      const blobImage = new BackgroundBlobImage(
        name,
        url,
        hash,
        blob,
        blob.type,
      );

      createBackgroundImage(blobImage);
    }
  }
}
