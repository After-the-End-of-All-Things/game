import { IItem, Rarity } from '@interfaces';

export type IMarketItemExpanded = IMarketItem & {
  id: string;
  itemData: IItem;
};

export interface IMarketItem {
  createdAt: Date;
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
  seller: string;
  buyer: string;
  itemId: string;
  price: number;
  quantity: number;
  locality: string;
  expiresAt: Date;
}
