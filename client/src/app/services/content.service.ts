import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { ICollectible, IEquipment, IItem, IJob, ILocation } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private content = {
    locations: {},
    jobs: {},
    collectibles: {},
    equipment: {},
  };

  public readonly maxPortraits = 107;
  public readonly maxBackgrounds = 18;

  public get locations(): Record<string, ILocation> {
    return this.content.locations;
  }

  public get jobs(): Record<string, IJob> {
    return this.content.jobs;
  }

  public get collectibles(): Record<string, ICollectible> {
    return this.content.collectibles;
  }

  public get equipment(): Record<string, IEquipment> {
    return this.content.equipment;
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

  public getCollectible(collectible: string): ICollectible | undefined {
    return this.collectibles[collectible];
  }

  public getAllCollectibles(): ICollectible[] {
    return Object.values(this.collectibles);
  }

  public getEquipment(equipment: string): IEquipment | undefined {
    return this.equipment[equipment];
  }

  public getAllEquipment(): IEquipment[] {
    return Object.values(this.equipment);
  }

  public getItem(item: string): IItem | undefined {
    return this.getCollectible(item) || this.getEquipment(item);
  }
}
