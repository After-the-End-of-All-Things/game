import { cleanNumber } from '@helpers/input';
import {
  allAccessoryTypes,
  allArmorTypes,
  allWeaponTypes,
} from '@helpers/item';
import {
  IEquipment,
  IItem,
  IMarketItem,
  IPagination,
  UserResponse,
} from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ContentService } from '@modules/content/content.service';
import { PlayerHelperService } from '@modules/content/playerhelper.service';
import { InventoryService } from '@modules/inventory/inventory.service';
import { MarketItem } from '@modules/market/marketitem.schema';
import { MarketSale } from '@modules/market/marketsale.schema';
import { Player } from '@modules/player/player.schema';
import { PlayerService } from '@modules/player/player.service';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getPatchesAfterPropChanges } from '@utils/patches';
import { userError } from '@utils/usernotifications';
import { Logger } from 'nestjs-pino';

@Injectable()
export class MarketService {
  constructor(
    private readonly logger: Logger,
    private readonly em: EntityManager,
    @InjectRepository(MarketItem)
    private readonly marketItem: EntityRepository<MarketItem>,
    @InjectRepository(MarketSale)
    private readonly marketSale: EntityRepository<MarketSale>,
    private readonly userService: UserService,
    private readonly playerService: PlayerService,
    private readonly inventoryService: InventoryService,
    private readonly contentService: ContentService,
    private readonly playerHelper: PlayerHelperService,
    private events: EventEmitter2,
  ) {}

  async listItem(
    userId: string,
    instanceId: string,
    price: number,
    quantity = 1,
  ): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException(`Player ${userId} not found`);

    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const isResource = this.contentService.getResource(instanceId);
    let itemRef: IItem | undefined;
    let itemId = '';

    if (isResource) {
      itemRef = isResource;
      itemId = isResource.itemId;
    } else {
      const inventoryItem = await this.inventoryService.getInventoryItemForUser(
        userId,
        instanceId,
      );

      if (!inventoryItem)
        throw new NotFoundException(`Inventory item ${instanceId} not found.`);
      if (inventoryItem.isInUse)
        throw new BadRequestException(`Item ${instanceId} is in use already`);

      itemRef = this.contentService.getItem(inventoryItem.itemId);
      itemId = inventoryItem.itemId;
    }

    if (!itemRef || !itemId)
      throw new NotFoundException(`Item ref ${itemId} not found`);

    const validQuantity = isResource
      ? cleanNumber(quantity, 1, {
          round: true,
          abs: true,
          min: 1,
        })
      : 1;

    const hasResourceQuantity = await this.inventoryService.hasResource(
      userId,
      instanceId,
      validQuantity,
    );
    if (isResource && !hasResourceQuantity)
      return userError('Not enough resources');

    const validPrice = cleanNumber(price * validQuantity, 0, {
      round: true,
      abs: true,
      min: 0,
    });
    if (validPrice < 1) return userError('Price must be more than 0 coins.');

    const playerLocation = this.contentService.getLocation(
      player.location.current,
    );
    if (!playerLocation)
      throw new NotFoundException(
        `Location ${player.location.current} not found`,
      );

    const taxRate = playerLocation.baseStats.taxRate ?? 5;
    const tax = Math.floor(validPrice * (taxRate / 100));

    if (!this.playerHelper.hasCoins(player, tax))
      return userError(`Not enough coins, you need ${tax.toLocaleString()}!`);

    const dbItem = new MarketItem(
      userId,
      itemId,
      validPrice,
      validQuantity,
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

    if (isResource) {
      await this.inventoryService.removeResource(userId, itemId, validQuantity);
    } else {
      await this.inventoryService.removeInventoryItemForUser(
        userId,
        instanceId,
      );
    }

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (player) => {
        this.playerHelper.spendCoins(player, tax);
      },
    );

    try {
      await this.marketItem.create(dbItem);
    } catch (e) {
      this.logger.error(e);
      throw e;
    } finally {
      await this.em.flush();
    }

    this.logger.verbose(
      `User ${userId} listed item ${instanceId} x${validQuantity} for ${price} coins.`,
    );

    return {
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You listed ${
            itemRef.name
          } x${validQuantity.toLocaleString()} for ${validPrice.toLocaleString()} coins!`,
        },
        !isResource
          ? {
              type: 'RemoveInventoryItem',
              instanceId,
            }
          : undefined,
        isResource
          ? {
              type: 'RemoveInventoryResource',
              itemId,
              quantity: validQuantity,
            }
          : undefined,
      ].filter(Boolean),
    };
  }

  async getItems(
    askingUser: string,
    query: any,
    getMyItems = false,
  ): Promise<IPagination<IMarketItem>> {
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
      userId: getMyItems ? askingUser : { $ne: askingUser },
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
      fields: ['internalId', 'itemId', 'price', 'quantity'],
    });

    return {
      total,
      limit,
      page: Math.min(page, Math.ceil(total / limit)),
      lastPage: Math.ceil(total / limit),
      results: items,
    };
  }

  async getMyValue(userId: string): Promise<number> {
    const allSoldListings = await this.marketItem.find({
      userId,
      isSold: true,
    });

    return allSoldListings.reduce((prev, curr) => prev + curr.price, 0);
  }

  async claimMyValue(userId: string): Promise<UserResponse> {
    const totalValue = await this.getMyValue(userId);
    if (totalValue <= 0)
      return userError('The market currently owes you no coins.');

    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException(`Player ${userId} not found`);

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (player) => {
        this.playerHelper.gainCoins(player, totalValue);
      },
    );

    await this.em.nativeDelete<MarketItem>(MarketItem, {
      userId,
      isSold: true,
    });

    this.logger.verbose(`User ${userId} claimed ${totalValue} coins.`);

    return {
      player: playerPatches,
      actions: [
        {
          type: 'Notify',
          messageType: 'success',
          message: `You claimed ${totalValue.toLocaleString()} coins!`,
        },
      ],
    };
  }

  async buyItem(userId: string, listingId: string): Promise<UserResponse> {
    const listing = await this.marketItem.findOne({
      internalId: listingId,
    });
    if (!listing) return userError(`That item has already sold!`);

    if (listing.meta.listedById === userId)
      throw new BadRequestException('You cannot buy your own listing');

    if (listing.isSold) return userError(`That item has already sold!`);

    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException(`Player ${userId} not found`);

    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const isResource = this.contentService.getResource(listing.itemId);

    const itemRef = this.contentService.getItem(listing.itemId);
    if (!itemRef && !isResource)
      throw new NotFoundException(`Item ref ${listing.itemId} not found`);

    const inventory = await this.inventoryService.getInventoryForUser(userId);
    if (!inventory)
      throw new NotFoundException(`Inventory ${userId} not found`);

    if (!this.playerHelper.hasCoins(player, listing.price))
      return userError('Not enough coins');

    const isInventoryFull = await this.inventoryService.isInventoryFull(userId);
    if (isInventoryFull && !isResource)
      return userError('Your inventory is full!');

    listing.isSold = true;

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (player) => {
        this.playerHelper.spendCoins(player, listing.price);
      },
    );

    if (listing.meta.type === 'resource') {
      await this.inventoryService.acquireResource(
        userId,
        listing.itemId,
        listing.quantity,
      );
    } else {
      await this.inventoryService.acquireItem(userId, listing.itemId);
    }

    this.events.emit('notification.create', {
      userId: listing.userId,
      notification: {
        liveAt: new Date(),
        text: `Your ${listing.meta.name} x${
          listing.quantity
        } sold for ${listing.price.toLocaleString()} coins!`,
        actions: [],
      },
      expiresAfterHours: 1,
    });

    await this.recordSale(userId, listing);

    this.logger.verbose(
      `User ${userId} bought ${listing.itemId} for ${listing.price} coins.`,
    );

    return {
      player: playerPatches,
      actions: [
        {
          type: 'RemoveMarketItem',
          listingId,
        },
        { type: 'UpdateInventoryItems' },
        {
          type: 'Notify',
          messageType: 'success',
          message: `You bought ${listing.meta.name} x${
            listing.quantity
          } for ${listing.price.toLocaleString()} coins!`,
        },
      ],
    };
  }

  async repriceItem(
    userId: string,
    listingId: string,
    price: number,
  ): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException(`Player ${userId} not found`);

    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const listing = await this.marketItem.findOne({
      internalId: listingId,
    });
    if (!listing) throw new NotFoundException(`Listing ${listingId} not found`);
    if (listing.isSold) return userError(`That item has already sold!`);

    if (listing.userId !== userId)
      throw new BadRequestException('You cannot reprice this listing');

    const quantity = listing.quantity ?? 1;
    const validPrice = cleanNumber(price * quantity, 0, {
      round: true,
      abs: true,
      min: 0,
    });
    if (validPrice < 1) return userError('Price must be more than 0 coins.');

    if (listing.price === validPrice)
      return userError('Price is the same as before.');

    const playerLocation = this.contentService.getLocation(
      player.location.current,
    );
    if (!playerLocation)
      throw new NotFoundException(
        `Location ${player.location.current} not found`,
      );

    const taxRate = playerLocation.baseStats.taxRate ?? 5;
    const tax = Math.max(1, Math.floor(validPrice * (taxRate / 100)));

    if (!this.playerHelper.hasCoins(player, tax))
      return userError('Not enough coins');

    const playerPatches = await getPatchesAfterPropChanges<Player>(
      player,
      async (player) => {
        this.playerHelper.spendCoins(player, tax);
      },
    );

    listing.price = validPrice;

    this.logger.verbose(
      `User ${userId} repriced ${listing.itemId} for ${validPrice} coins.`,
    );

    return {
      player: playerPatches,
      actions: [
        {
          type: 'RepriceMarketItem',
          listingId,
          newPrice: validPrice,
        },
        {
          type: 'Notify',
          messageType: 'success',
          message: `You repriced ${
            listing.meta.name
          } x${quantity.toLocaleString()} for ${validPrice.toLocaleString()} coins!`,
        },
      ],
    };
  }

  async unlistItem(userId: string, listingId: string): Promise<UserResponse> {
    const player = await this.playerService.getPlayerForUser(userId);
    if (!player) throw new NotFoundException(`Player ${userId} not found`);

    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const listing = await this.marketItem.findOne({
      internalId: listingId,
    });
    if (!listing) throw new NotFoundException(`Listing ${listingId} not found`);
    if (listing.isSold) return userError(`That item has already sold!`);

    if (listing.userId !== userId)
      throw new BadRequestException('You cannot remove this listing');

    const isResource = this.contentService.getResource(listing.itemId);
    const isInventoryFull = await this.inventoryService.isInventoryFull(userId);
    if (!isResource && isInventoryFull)
      return userError('Your inventory is full!');

    if (listing.meta.type === 'resource') {
      await this.inventoryService.acquireResource(
        userId,
        listing.itemId,
        listing.quantity,
      );
    } else {
      await this.inventoryService.acquireItem(userId, listing.itemId);
    }

    await this.em.nativeDelete<MarketItem>(MarketItem, {
      internalId: listingId,
    });

    this.logger.verbose(`User ${userId} unlisted ${listing.itemId}.`);

    return {
      actions: [
        {
          type: 'RemoveMarketItem',
          listingId,
        },
        { type: 'UpdateInventoryItems' },
        {
          type: 'Notify',
          messageType: 'success',
          message: `You unlisted ${listing.meta.name} x${listing.quantity}!`,
        },
      ],
    };
  }

  private async recordSale(buyer: string, listing: MarketItem) {
    const dbItem = new MarketSale(
      listing.userId,
      buyer,
      listing.itemId,
      listing.price,
      listing.quantity,
      listing.locality,
    );

    await this.marketSale.create(dbItem);
  }
}
