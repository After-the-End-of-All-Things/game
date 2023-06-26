import { IFullUser, IPatchUser } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ContentService } from '@modules/content/content.service';
import { Discoveries } from '@modules/discoveries/discoveries.schema';
import { InventoryService } from '@modules/inventory/inventory.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getPatchesAfterPropChanges } from '@utils/patches';

@Injectable()
export class DiscoveriesService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Discoveries)
    private readonly discoveries: EntityRepository<Discoveries>,
    private readonly inventoryService: InventoryService,
    private readonly contentService: ContentService,
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

  discoverLocation(discoveries: Discoveries, locationName: string): boolean {
    if (discoveries.locations[locationName]) return false;

    discoveries.locations = { ...discoveries.locations, [locationName]: true };
    return true;
  }

  async discoverCollectible(
    userId: string,
    instanceId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    const discoveries = await this.getDiscoveriesForUser(userId);
    if (!discoveries) throw new NotFoundException('User not found');

    const item = await this.inventoryService.getInventoryItemForUser(
      userId,
      instanceId,
    );
    if (!item) throw new NotFoundException('Item not found');

    const itemDefinition = await this.contentService.getCollectible(
      item.itemId,
    );
    if (!itemDefinition)
      throw new NotFoundException('Item definition not found');

    if (discoveries.collectibles?.[itemDefinition.itemId])
      throw new ForbiddenException('Collectible already discovered');

    await this.inventoryService.removeInventoryItemForUser(userId, instanceId);

    const discoveryPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discoveriesRef) => {
        discoveriesRef.collectibles = {
          ...(discoveriesRef.collectibles || {}),
          [itemDefinition.itemId]: true,
        };
      },
    );

    return { discoveries: discoveryPatches };
  }

  async discoverEquipment(
    userId: string,
    instanceId: string,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    const discoveries = await this.getDiscoveriesForUser(userId);
    if (!discoveries) throw new NotFoundException('User not found');

    const item = await this.inventoryService.getInventoryItemForUser(
      userId,
      instanceId,
    );
    if (!item) throw new NotFoundException('Item not found');

    const itemDefinition = await this.contentService.getEquipment(item.itemId);
    if (!itemDefinition)
      throw new NotFoundException('Item definition not found');

    if (discoveries.items?.[itemDefinition.itemId])
      throw new ForbiddenException('Item already discovered');

    await this.inventoryService.removeInventoryItemForUser(userId, instanceId);

    const discoveryPatches = await getPatchesAfterPropChanges<Discoveries>(
      discoveries,
      async (discoveriesRef) => {
        discoveriesRef.items = {
          ...(discoveriesRef.items || {}),
          [itemDefinition.itemId]: true,
        };
      },
    );

    return { discoveries: discoveryPatches };
  }
}
