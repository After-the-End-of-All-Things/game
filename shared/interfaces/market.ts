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