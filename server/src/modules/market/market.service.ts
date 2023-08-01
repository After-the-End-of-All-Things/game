import { cleanNumber } from '@helpers/input';
import {
  allAccessoryTypes,
  allArmorTypes,
  allWeaponTypes,
} from '@helpers/item';
import {
  IEquipment,
  IFullUser,
  IMarketItem,
  IPagination,
  IPatchUser,
} from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ContentService } from '@modules/content/content.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { InventoryService } from '@modules/inventory/inventory.service';
import { MarketItem } from '@modules/market/marketitem.schema';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { UserService } from '@modules/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { getPatchesAfterPropChanges } from '@utils/patches';

@Injectable()
export class MarketService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(MarketItem)
    private readonly marketItem: EntityRepository<MarketItem>,
    private readonly userService: UserService,
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

    const user = await this.userService.findUserById(userId);
    if (!user) throw new BadRequestException('User not found');

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
      item.itemId,
      validPrice,
      playerLocation.name,
      {
        rarity: itemRef.rarity,
        level: (itemRef as IEquipment).levelRequirement ?? 0,
        name: itemRef.name,
        type: itemRef.type,
        listedBy: user.username,
        listedById: user.discriminator,
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

  async getItems(query: any): Promise<IPagination<IMarketItem>> {
    const { name, levelMin, levelMax, costMin, costMax, types, rarities } =
      query;

    const page = cleanNumber(query.page, 0, { round: true });

    const filterName = name
      ? { 'meta.name': { $regex: name, $options: 'i' } }
      : {};

    const filterLevel: any = {};

    const filterCost: any = {};

    const filterRarities =
      rarities.split(',').filter(Boolean).length > 0
        ? { 'meta.rarity': { $in: rarities.split(',') } }
        : {};
    const filterTypes: any = {};

    if (levelMin || levelMax) {
      const levelMinNum = cleanNumber(levelMin, 0, {
        round: true,
        abs: true,
        min: 0,
      });

      const levelMaxNum = cleanNumber(levelMax, 0, {
        round: true,
        abs: true,
        min: 0,
      });

      filterLevel['meta.level'] = {};
      if (levelMinNum > 0) filterLevel['meta.level'].$gte = levelMinNum;
      if (levelMaxNum > 0) filterLevel['meta.level'].$lte = levelMaxNum;
    }

    if (costMin || costMax) {
      const costMinNum = cleanNumber(costMin, 0, {
        round: true,
        abs: true,
        min: 0,
      });

      const costMaxNum = cleanNumber(costMax, 0, {
        round: true,
        abs: true,
        min: 0,
      });

      filterLevel['cost'] = {};
      if (costMinNum > 0) filterCost['cost'].$gte = costMinNum;
      if (costMaxNum > 0) filterCost['cost'].$lte = costMaxNum;
    }

    if (types.length > 0) {
      filterTypes['meta.type'] = {
        $in: [
          ...(types.includes('Weapons') ? [allWeaponTypes()] : []),
          ...(types.includes('Armors') ? [allArmorTypes()] : []),
          ...(types.includes('Accessories') ? [allAccessoryTypes()] : []),
          ...(types.includes('Collectibles') ? ['collectible'] : []),
          ...(types.includes('Resources') ? ['resource'] : []),
        ]
          .flat()
          .filter(Boolean),
      };
    }

    const limit = 25;

    const resultQuery = {
      isSold: { $ne: true },
      ...filterName,
      ...filterLevel,
      ...filterCost,
      ...filterRarities,
      ...filterTypes,
    };

    const total = await this.marketItem.count(resultQuery);
    const items = await this.marketItem.find(resultQuery, {
      limit,
      offset: page * limit,
      fields: ['_id', 'itemId', 'price'],
    });

    return {
      total,
      limit,
      page: Math.min(page, Math.ceil(total / limit)),
      lastPage: Math.ceil(total / limit),
      results: items,
    };
  }
}
