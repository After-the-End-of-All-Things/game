import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CompareItemsModalComponent } from '@components/modals/compare-items/compare-items.component';
import { isAccessory, isWeapon } from '@helpers/item';
import {
  Armor,
  Currency,
  IEquipment,
  IItem,
  IMarketItem,
  IPagination,
  IPlayer,
  ItemSlot,
  Rarity,
  Weapon,
} from '@interfaces';
import { ModalController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { MarketService } from '@services/market.service';
import { InventoryStore, PlayerStore } from '@stores';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
})
export class MarketModalComponent implements OnInit {
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;
  @Select(InventoryStore.equipped) equipped$!: Observable<
    Record<ItemSlot, IEquipment>
  >;

  private destroyRef = inject(DestroyRef);

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

  public marketResults: IPagination<IMarketItem & { itemData: IItem }> = {
    limit: 25,
    page: 0,
    lastPage: 0,
    results: [],
    total: 0,
  };

  public searchRarities: Record<string, boolean> = {};
  public searchTypes: Record<string, boolean> = {};

  public searchName = '';
  public searchLevelMin = 0;
  public searchLevelMax = 0;
  public searchCostMin = 0;
  public searchCostMax = 0;

  public loading = false;

  public player!: IPlayer;
  public equipment!: Record<ItemSlot, IEquipment>;

  public get coins(): number {
    return this.player?.currencies[Currency.Coins] ?? 0;
  }

  constructor(
    private modalCtrl: ModalController,
    private contentService: ContentService,
    private marketService: MarketService,
  ) {}

  ngOnInit() {
    this.search();

    this.player$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((player) => {
        this.player = player;
      });

    this.equipped$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((equipment) => {
        this.equipment = equipment;
      });
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

  public isEquippableItemType(item: IItem) {
    return item.type !== 'collectible' && item.type !== 'resource';
  }

  public changePage(newPage: number) {
    this.marketResults.page = newPage;

    this.search();
  }

  public search() {
    this.loading = true;

    this.marketService
      .getItems({
        page: this.marketResults.page,
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
      .subscribe((results) => {
        const itemResults = results.results.map((item) => ({
          ...item,
          itemData: this.contentService.getItem(item.itemId)!,
        }));

        this.marketResults = {
          ...results,
          results: itemResults,
        };

        this.loading = false;
      });
  }

  public canEquipItem(item: IItem): boolean {
    if (!this.isEquippableItemType(item) || !this.player) return false;

    const playerRef = this.player;
    const playerJob = this.contentService.getJob(playerRef.job);
    return !!(
      playerRef.level >= ((item as IEquipment).levelRequirement ?? 0) &&
      (playerJob?.armorSlots[item.type as Armor] ||
        playerJob?.weapons[item.type as Weapon])
    );
  }

  public buyItem(listing: Partial<IMarketItem & { id: string }>) {
    console.log(listing);
  }

  public canCompare(item: IItem) {
    return !isAccessory(item);
  }

  private async compareItems(
    item1: IItem,
    item2: IItem | undefined,
    success: () => void,
  ) {
    const modal = await this.modalCtrl.create({
      component: CompareItemsModalComponent,
      componentProps: {
        item1,
        item2,
        canEquip: false,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      success();
    }
  }

  private getEquippedItem(
    slot: ItemSlot | string,
    equipment?: Record<ItemSlot, IEquipment>,
  ): IEquipment | undefined {
    return equipment?.[slot as ItemSlot];
  }

  public compareItem(item: IItem) {
    const isItemWeapon = isWeapon(item);
    const checkType = isItemWeapon ? 'weapon' : item.type;
    const currentItem = this.getEquippedItem(checkType, this.equipment);
    this.compareItems(item, currentItem, () => {});
  }
}
