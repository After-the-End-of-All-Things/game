import { cleanNumber } from '@helpers/input';
import { IEquipment, IFullUser, IPatchUser } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ContentService } from '@modules/content/content.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { InventoryService } from '@modules/inventory/inventory.service';
import { MarketItem } from '@modules/market/marketitem.schema';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { getPatchesAfterPropChanges } from '@utils/patches';

@Injectable()
export class MarketService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(MarketItem)
    private readonly marketItem: EntityRepository<MarketItem>,
    private readonly playerService: PlayerService,
    private readonly inventoryService: InventoryService,
    private readonly contentService: ContentService,
    private readonly playerHelper: PlayerHelperService,
  ) {}

  async listItem(
    userId: string,
    instanceId: string,
    price: number,
  ): Promise<Partial<IFullUser | IPatchUser>> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new BadRequestException('Player not found');

    const item = await this.inventoryService.getInventoryItemForUser(
      userId,
      instanceId,
    );

    if (!item) throw new BadRequestException('Item not found');
    if (item.isInUse) throw new BadRequestException('Item is in use');

    const itemRef = this.contentService.getItem(item.itemId);
    if (!itemRef) throw new BadRequestException('Item not found');

    const validPrice = cleanNumber(price, 0, {
      round: true,
      abs: true,
      min: 0,
    });
    if (validPrice < 1) throw new BadRequestException('Invalid price');

    const playerLocation = this.contentService.getLocation(
      player.location.current,
    );
    if (!playerLocation) throw new BadRequestException('Location not found');

    const taxRate = playerLocation.baseStats.taxRate ?? 5;
    const tax = Math.floor(validPrice * (taxRate / 100));

    if (!this.playerHelper.hasCoins(player, tax))
      throw new BadRequestException('Not enough coins');

    const dbItem = new MarketItem(
      userId,
      instanceId,
      validPrice,
      playerLocation.name,
      {
        rarity: itemRef.rarity,
        level: (itemRef as IEquipment).levelRequirement ?? 0,
        name: itemRef.name,
        type: itemRef.type,
      },
    );
    await this.marketItem.create(dbItem);
    await this.inventoryService.removeInventoryItemForUser(userId, instanceId);

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (player) => {
        this.playerHelper.spendCoins(player, tax);
      },
    );

    await this.em.flush();

    return {
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You listed ${
            itemRef.name
          } for ${validPrice.toLocaleString()} coins!`,
        },
        {
          type: 'UpdateInventoryItems',
        },
      ],
    };
  }
}
