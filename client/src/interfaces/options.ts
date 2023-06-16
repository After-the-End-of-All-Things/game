export enum GameOption {
  AssetQuality = 'assetQuality',
}

export interface IOptionsStore {
  version: number;
  options: Record<GameOption, number | string>;
}
