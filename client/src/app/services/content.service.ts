import { Injectable } from '@angular/core';
import { environment } from '@environment';
import {
  ICollectible,
  IEquipment,
  IItem,
  IJob,
  ILocation,
  IRecipe,
  IResource,
} from '@interfaces';
import { AssetService } from '@services/asset.service';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private content = {
    locations: {},
    jobs: {},
    collectibles: {},
    equipment: {},
    resources: {},
    recipes: {},
  };

  public get maxPortraits() {
    return this.assetService.portraitCount;
  }

  public get maxBackgrounds() {
    return this.assetService.backgroundCount;
  }

  public get locations(): Record<string, ILocation> {
    return this.content.locations;
  }

  public get jobs(): Record<string, IJob> {
    return this.content.jobs;
  }

  public get collectibles(): Record<string, ICollectible> {
    return this.content.collectibles;
  }

  public get resources(): Record<string, IResource> {
    return this.content.resources;
  }

  public get equipment(): Record<string, IEquipment> {
    return this.content.equipment;
  }

  public get recipes(): Record<string, IRecipe> {
    return this.content.recipes;
  }

  constructor(private assetService: AssetService) {}

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

  public getResource(resource: string): IResource | undefined {
    return this.resources[resource];
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
    return (
      this.getCollectible(item) ||
      this.getEquipment(item) ||
      this.getResource(item)
    );
  }

  public getRecipes(): IRecipe[] {
    return Object.values(this.recipes);
  }
}
