import { Rarity } from './buildingblocks';
import { IItem } from './item';

export type IMarketItemExpanded = IMarketItem & {
  itemData: IItem;
};

export interface IMarketItem {
  createdAt: Date;
  internalId: string;
  userId: string;
  itemId: string;
  price: number;
  quantity: number;
  locality: string;
  isSold: boolean;
  isClaimed: boolean;

  meta: IMarketItemMeta;
}

export interface IMarketItemMeta {
  name: string;
  level: number;
  type: string;
  rarity: Rarity;
  listedBy: string;
  listedById: string;
}

export interface IMarketSale {
  createdAt: Date;
  internalId: string;
  seller: string;
  buyer: string;
  itemId: string;
  price: number;
  quantity: number;
  locality: string;
  expiresAt: Date;
}
