export interface IDiscoveries {
  locations: Record<string, boolean>;
  portraits: Record<string, boolean>;
  backgrounds: Record<string, boolean>;
  borders: Record<string, boolean>;
  collectibles: Record<string, number>;
  items: Record<string, number>;
  monsters: Record<string, number>;
  uniqueCollectibleClaims: number;
  totalCollectibleClaims: number;
  uniqueEquipmentClaims: number;
  totalEquipmentClaims: number;
  uniqueMonsterClaims: number;
  totalMonsterClaims: number;
}
