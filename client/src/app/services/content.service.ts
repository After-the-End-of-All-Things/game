import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { IJob, ILocation } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private content = { locations: {}, jobs: {} };

  public get locations(): Record<string, ILocation> {
    return this.content.locations;
  }

  public get jobs(): Record<string, IJob> {
    return this.content.jobs;
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

  public getLocation(location: string): ILocation | undefined {
    return this.locations[location];
  }

  public getJob(job: string): IJob | undefined {
    return this.jobs[job];
  }
}
