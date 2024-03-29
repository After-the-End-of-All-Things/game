import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  BlobImage,
  createImage,
  deleteImage,
  readImageByURL,
  readImagesByNameAndQuality,
} from '@services/image.db';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
  ) {}

  async getCSSBackgroundImageURL(url: string) {
    const image = await readImageByURL(url);
    if (!image) {
      return `url('${url}')`;
    }

    const safeURL: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(image.data),
    );

    return this.getSafeBackgroundImageUrl(safeURL);
  }

  private getSafeBackgroundImageUrl(url: any) {
    return `url("${url.changingThisBreaksApplicationSecurity}")`;
  }

  async getImageDataByUrl(url: string) {
    return readImageByURL(url);
  }

  async getSafeImageUrl(name: string, quality: string) {
    const baseUrl = await this.getImageUrl(name, quality);
    return (baseUrl as any).changingThisBreaksApplicationSecurity;
  }

  async getImageUrl(name: string, quality: string) {
    const blob = await readImagesByNameAndQuality(name, quality);
    if (!blob) {
      return '';
    }

    const safeURL: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(blob.data),
    );

    return safeURL;
  }

  fetchImage(url: string): Observable<Blob> {
    return this.httpClient.get(url, {
      responseType: 'blob',
    });
  }

  async saveImageToDatabase(
    name: string,
    hash: string,
    quality: string,
    url: string,
    blob: Blob,
  ) {
    const oldImage = await readImageByURL(url);
    if (oldImage) {
      deleteImage((oldImage as any).id);
    }

    const blobImage = new BlobImage(name, hash, quality, url, blob, blob.type);

    createImage(blobImage);
  }
}
