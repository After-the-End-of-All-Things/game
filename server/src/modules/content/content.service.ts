import { Injectable, NotFoundException } from '@nestjs/common';

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
import * as fs from 'fs-extra';
import { Logger } from 'nestjs-pino';

import { CensorSensor } from 'censor-sensor';

const censor = new CensorSensor();
censor.disableTier(4);
censor.disableTier(2);

@Injectable()
export class ContentService {
  public content = {
    meta: {},
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

  constructor(private logger: Logger) {}

  public get censor(): CensorSensor {
    return censor;
  }

  private get locations(): Record<string, ILocation> {
    return this.content.locations;
  }

  private get jobs(): Record<string, IJob> {
    return this.content.jobs;
  }

  private get collectibles(): Record<string, ICollectible> {
    return this.content.collectibles;
  }

  private get equipment(): Record<string, IEquipment> {
    return this.content.equipment;
  }

  private get resources(): Record<string, IResource> {
    return this.content.resources;
  }

  private get recipes(): Record<string, IRecipe> {
    return this.content.recipes;
  }

  private get abilities(): Record<string, ICombatAbility> {
    return this.content.abilities;
  }

  private get monsters(): Record<string, IMonster> {
    return this.content.monsters;
  }

  private get formations(): Record<string, IMonsterFormation> {
    return this.content.formations;
  }

  private get npcs(): Record<string, ILocationNPC> {
    return this.content.npcs;
  }

  public async reloadContent() {
    this.logger.log('Loading game content over HTTP...');

    try {
      const data = await fetch('https://content.ateoat.com/content.json');
      const json = await data.json();

      this.content = json;

      // this isn't relevant in the game server context, but is useful in case someone forgets to run setup
      fs.writeJsonSync('content.json', json);
    } catch (e) {
      console.error(e);
    }
  }

  public async onModuleInit() {
    if (fs.existsSync('content.json')) {
      this.logger.log('Content exists locally; loading from file.');
      const content = fs.readJsonSync('content.json');
      this.content = content;
      return;
    }

    await this.reloadContent();
  }

  public allLocations(): ILocation[] {
    return Object.values(this.locations ?? {});
  }

  public getLocation(location: string): ILocation {
    const locationRef = this.locations[location];
    if (!location)
      throw new NotFoundException(`Location ${location} not found!`);

    return locationRef;
  }

  public allJobs(): IJob[] {
    return Object.values(this.jobs ?? {});
  }

  public getJob(job: string): IJob {
    const jobRef = this.jobs[job];
    if (!jobRef) throw new NotFoundException(`Job ${job} not found!`);

    return jobRef;
  }

  public allCollectibles(): ICollectible[] {
    return Object.values(this.collectibles ?? {});
  }

  public allResources(): IResource[] {
    return Object.values(this.resources ?? {});
  }

  public getResource(resourceId: string): IResource {
    const resourceRef = this.resources[resourceId];
    if (!resourceRef)
      throw new NotFoundException(`Resource ${resourceId} not found!`);

    return resourceRef;
  }

  public getCollectible(collectibleId: string): ICollectible {
    const collectibleRef = this.collectibles[collectibleId];
    if (!collectibleRef)
      throw new NotFoundException(`Collectible ${collectibleId} not found!`);

    return collectibleRef;
  }

  public allEquipment(): IEquipment[] {
    return Object.values(this.equipment ?? {});
  }

  public getEquipment(equipmentId: string): IEquipment {
    const equipmentRef = this.equipment[equipmentId];
    if (!equipmentRef)
      throw new NotFoundException(`Equipment ${equipmentId} not found!`);

    return equipmentRef;
  }

  public getItem(item: string): IItem {
    return this.equipment[item] || this.collectibles[item];
  }

  public hasRecipe(item: string): boolean {
    return !!this.recipes[item];
  }

  public getRecipe(item: string): IRecipe {
    const recipeRef = this.recipes[item];
    if (!recipeRef) throw new NotFoundException(`Recipe ${item} not found!`);

    return recipeRef;
  }

  public allFormations(): IMonsterFormation[] {
    return Object.values(this.formations ?? {});
  }

  public getFormation(formation: string): IMonsterFormation {
    const formationRef = this.formations[formation];
    if (!formationRef)
      throw new NotFoundException(`Formation ${formation} not found!`);

    return formationRef;
  }

  public getMonster(monster: string): IMonster {
    const monsterRef = this.monsters[monster];
    if (!monsterRef)
      throw new NotFoundException(`Monster ${monster} not found!`);

    return monsterRef;
  }

  public allAbilities(): ICombatAbility[] {
    return Object.values(this.abilities ?? {});
  }

  public getAbility(ability: string): ICombatAbility {
    const abilityRef = this.abilities[ability];
    if (!abilityRef)
      throw new NotFoundException(`Ability ${ability} not found!`);

    return abilityRef;
  }

  public allNPCs(): ILocationNPC[] {
    return Object.values(this.npcs ?? {});
  }

  public getNPC(npc: string): ILocationNPC {
    const npcRef = this.npcs[npc];
    if (!npcRef) throw new NotFoundException(`NPC ${npc} not found!`);

    return npcRef;
  }
}
