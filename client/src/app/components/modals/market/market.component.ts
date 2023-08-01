import { Component, OnInit } from '@angular/core';
import { IMarketItem, Rarity } from '@interfaces';
import { ModalController } from '@ionic/angular';
import { MarketService } from '@services/market.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
})
export class MarketModalComponent implements OnInit {
  public readonly rarities: Rarity[] = [
    'Common',
    'Uncommon',
    'Unusual',
    'Rare',
    'Masterful',
    'Arcane',
    'Epic',
    'Divine',
    'Unique',
  ];

  public readonly itemTypes = [
    'Weapons',
    'Armors',
    'Accessories',
    'Collectibles',
    'Resources',
  ];

  public marketItems: IMarketItem[] = [];

  public searchRarities: Record<string, boolean> = {};
  public searchTypes: Record<string, boolean> = {};

  public searchName = '';
  public searchLevelMin = 0;
  public searchLevelMax = 0;
  public searchCostMin = 0;
  public searchCostMax = 0;

  constructor(
    private modalCtrl: ModalController,
    private marketService: MarketService,
  ) {}

  ngOnInit() {
    this.search();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  public toggleRarity(rarity: Rarity) {
    this.searchRarities[rarity] = !this.searchRarities[rarity];
  }

  public toggleType(type: string) {
    this.searchTypes[type] = !this.searchTypes[type];
  }

  public myListings() {}

  public search() {
    this.marketService
      .getItems({
        name: this.searchName,
        levelMin: this.searchLevelMin,
        levelMax: this.searchLevelMax,
        costMin: this.searchCostMin,
        costMax: this.searchCostMax,
        rarities: Object.keys(this.searchRarities).filter(
          (r) => this.searchRarities[r],
        ),
        types: Object.keys(this.searchTypes).filter((t) => this.searchTypes[t]),
      })
      .subscribe((items) => {
        this.marketItems = items;
      });
  }
}
