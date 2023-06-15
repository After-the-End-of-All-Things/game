import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class DiscoveriesService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Discoveries)
    private readonly discoveries: EntityRepository<Discoveries>,
  ) {}

  async getDiscoveriesForUser(
    userId: string,
  ): Promise<Discoveries | undefined> {
    const dbDiscoveries = await this.discoveries.findOne({ userId });
    if (!dbDiscoveries) {
      return await this.createDiscoveriesForUser(userId);
    }

    return dbDiscoveries;
  }

  async createDiscoveriesForUser(
    userId: string,
  ): Promise<Discoveries | undefined> {
    const discoveries = new Discoveries(userId);

    try {
      await this.discoveries.create(discoveries);
      await this.em.flush();
    } catch (e) {
      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException('discoveries id already in use.');
      }
    }

    return discoveries;
  }

  discoverLocation(discoveries: Discoveries, locationName: string) {
    if (discoveries.locations[locationName]) return;

    discoveries.locations = { ...discoveries.locations, [locationName]: true };
  }
}
