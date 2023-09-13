import { Injectable } from '@angular/core';
import { environment } from '@environment';
import {
  ICollectible,
  ICombatAbility,
  IEquipment,
  IItem,
  IJob,
  ILocation,
  ILocationNPC,
  IMonster,
  IMonsterFormation,
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
    abilities: {},
    monsters: {},
    formations: {},
    npcs: {},
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

  public get abilities(): Record<string, ICombatAbility> {
    return this.content.abilities;
  }

  public get monsters(): Record<string, IMonster> {
    return this.content.monsters;
  }

  public get formations(): Record<string, IMonsterFormation> {
    return this.content.formations;
  }

  public get npcs(): Record<string, ILocationNPC> {
    return this.content.npcs;
  }

  constructor(private assetService: AssetService) {}

  public async init() {
    try {
      await this.loadServerContent();
      console.log(`Loaded content from server; skipping global content load.`);
    } catch {
      console.error(
        `Could not load server content; server may be down. Loading global content instead.`,
      );

      await this.loadGlobalContent();
    }
  }

  private async loadServerContent() {
    await this.loadContent(
      `${environment.apiUrl}/game/content/version`,
      `${environment.apiUrl}/game/content`,
    );
  }

  private async loadGlobalContent() {
    await this.loadContent(
      `${environment.contentUrl}/version.json`,
      `${environment.contentUrl}/content.json`,
    );
  }

  private async loadContent(versionUrl: string, contentUrl: string) {
    const version = await fetch(versionUrl);
    const versionData = await version.json();

    const oldVersion = localStorage.getItem('contentVersion');
    const localContent = localStorage.getItem('content');

    if (oldVersion !== versionData.hash || !localContent) {
      const content = await fetch(contentUrl);
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

  public getAllMonsters(): IMonster[] {
    return Object.values(this.monsters);
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

  public getFormation(formation: string): IMonsterFormation | undefined {
    return this.formations[formation];
  }

  public getMonster(monster: string): IMonster | undefined {
    return this.monsters[monster];
  }

  public getAbilityByName(abilityName: string): ICombatAbility | undefined {
    return Object.values(this.abilities).find(
      (ability) => ability.name === abilityName,
    );
  }

  public getAbility(ability: string): ICombatAbility | undefined {
    return this.abilities[ability];
  }

  public getNPC(npc: string): ILocationNPC | undefined {
    return this.npcs[npc];
  }
}
