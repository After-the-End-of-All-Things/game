import { Injectable } from '@nestjs/common';

import { ICollectible, IEquipment, IItem, IJob, ILocation } from '@interfaces';
import * as fs from 'fs-extra';
import { Logger } from 'nestjs-pino';

import { CensorSensor } from 'censor-sensor';

const censor = new CensorSensor();
censor.disableTier(4);

@Injectable()
export class ContentService {
  public get censor(): CensorSensor {
    return censor;
  }

  public content = { locations: {}, jobs: {}, collectibles: {}, equipment: {} };

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

  constructor(private logger: Logger) {}

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
    return Object.values(this.locations);
  }

  public getLocation(location: string): ILocation | undefined {
    return this.locations[location];
  }

  public allJobs(): IJob[] {
    return Object.values(this.jobs);
  }

  public getJob(job: string): IJob | undefined {
    return this.jobs[job];
  }

  public allCollectibles(): ICollectible[] {
    return Object.values(this.collectibles);
  }

  public getCollectible(collectibleId: string): ICollectible | undefined {
    return this.collectibles[collectibleId];
  }

  public allEquipment(): IEquipment[] {
    return Object.values(this.equipment);
  }

  public getEquipment(equipmentId: string): IEquipment | undefined {
    return this.equipment[equipmentId];
  }

  public getItem(item: string): IItem | undefined {
    return this.equipment[item] || this.collectibles[item];
  }
}
