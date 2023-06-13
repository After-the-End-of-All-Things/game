import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { ILocation } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private content = { locations: [] };

  public get locations(): ILocation[] {
    return this.content.locations;
  }

  constructor() {}

  public async init() {
    const version = await fetch(`${environment.contentUrl}/version.json`);
    const versionData = await version.json();

    const oldVersion = localStorage.getItem('contentVersion');
    const localContent = localStorage.getItem('content');

    if (oldVersion !== versionData.hash || !localContent) {
      const content = await fetch(`${environment.contentUrl}/content.json`);
      const contentData = await content.json();

      this.content = contentData;

      localStorage.setItem('contentVersion', versionData.hash);
      localStorage.setItem('content', JSON.stringify(contentData));
    } else {
      this.content = JSON.parse(localContent);
    }
  }
}
