import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CompareItemsModalComponent } from '@components/modals/compare-items/compare-items.component';
import { isAccessory, isWeapon, itemValue } from '@helpers/item';
import {
  Armor,
  Currency,
  IEquipment,
  IItem,
  IMarketItem,
  IMarketItemExpanded,
  IPagination,
  IPlayer,
  ItemSlot,
  LocationStat,
  Rarity,
  Weapon,
} from '@interfaces';
import { AlertController, ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { MarketService } from '@services/market.service';
import { InventoryStore, MarketStore, PlayerStore } from '@stores';
import { SetMarketItems } from '@stores/market/market.actions';
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

  @Select(MarketStore.marketData) marketItems$!: Observable<
    IPagination<IMarketItemExpanded>
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

  public searchRarities: Record<string, boolean> = {};
  public searchTypes: Record<string, boolean> = {};

  public searchName = '';
  public searchLevelMin = 0;
  public searchLevelMax = 0;
  public searchCostMin = 0;
  public searchCostMax = 0;

  public searchPage = 0;

  public loading = false;
  public showingMyListings = false;

  public player!: IPlayer;
  public equipment!: Record<ItemSlot, IEquipment>;

  public get coins(): number {
    return this.player?.currencies[Currency.Coins] ?? 0;
  }

  public unclaimed = 0;

  constructor(
    private store: Store,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private contentService: ContentService,
    private marketService: MarketService,
  ) {}

  ngOnInit() {
    this.checkUnclaimedCoins();

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

  public isEquippableItemType(item: IItem) {
    return item.type !== 'collectible' && item.type !== 'resource';
  }

  public changeMyListings() {
    this.showingMyListings = !this.showingMyListings;
    this.searchPage = 0;

    this.search();
  }

  public changePage(newPage: number) {
    this.searchPage = newPage;

    this.search();
  }

  public search() {
    this.loading = true;

    this.marketService
      .getItems(
        {
          page: this.searchPage,
          name: this.searchName,
          levelMin: this.searchLevelMin,
          levelMax: this.searchLevelMax,
          costMin: this.searchCostMin,
          costMax: this.searchCostMax,
          rarities: Object.keys(this.searchRarities).filter(
            (r) => this.searchRarities[r],
          ),
          types: Object.keys(this.searchTypes).filter(
            (t) => this.searchTypes[t],
          ),
        },
        this.showingMyListings,
      )
      .subscribe((results) => {
        const itemResults = (results.results as IMarketItemExpanded[]).map(
          (item) => ({
            ...item,
            itemData: this.contentService.getItem(item.itemId)!,
          }),
        );

        this.store.dispatch(
          new SetMarketItems({
            ...results,
            results: itemResults,
          }),
        );

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

  public async buyItem(
    listing: Partial<IMarketItem & { id: string; itemData: IItem }>,
  ) {
    const alert = await this.alertCtrl.create({
      header: 'Buy Item',
      message: `Are you sure you want to buy "${
        listing.itemData?.name || 'this item'
      }" x${listing.quantity} for ${listing.price?.toLocaleString()} coins?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Buy',
          handler: async () => {
            this.marketService.buyItem(listing.id!).subscribe();
          },
        },
      ],
    });

    await alert.present();
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

  public checkUnclaimedCoins() {
    this.marketService.getClaimCoins().subscribe((result) => {
      this.unclaimed = result as number;
    });
  }

  public claimCoins() {
    this.marketService.claimCoins().subscribe(() => {
      this.unclaimed = 0;
    });
  }

  public async repriceItem(listing: IMarketItemExpanded) {
    const alert = await this.alertCtrl.create({
      header: 'Reprice Item',
      message: 'Enter the price you want to sell this item for.',
      inputs: [
        {
          name: 'price',
          type: 'number',
          placeholder: 'Price',
          value: listing.price,
          min: itemValue(listing.itemData),
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Reprice',
          handler: async ({ price }) => {
            this.store
              .selectOnce(PlayerStore.player)
              .subscribe(async (player) => {
                const location = player.location.current;
                const locationData = this.contentService.getLocation(location);
                if (!locationData) return;

                const quantity = listing.quantity ?? 1;

                const realPrice = Math.floor(price);
                const realPriceQtyAdjusted = Math.floor(realPrice * quantity);

                const taxPrice = Math.floor(
                  realPriceQtyAdjusted *
                    (locationData.baseStats[LocationStat.TaxRate] / 100),
                );

                const confirm = await this.alertCtrl.create({
                  header: 'Confirm Reprice',
                  message: `Are you sure you want to reprice this item at ${realPrice.toLocaleString()} coins? It will cost ${taxPrice.toLocaleString()} coins to reprice it.`,
                  buttons: [
                    {
                      text: 'Cancel',
                      role: 'cancel',
                    },
                    {
                      text: 'Reprice',
                      handler: async () => {
                        this.marketService
                          .repriceItem(listing, realPrice)
                          .subscribe(() => {});
                      },
                    },
                  ],
                });

                await confirm.present();
              });
          },
        },
      ],
    });

    await alert.present();
  }

  public async unlistItem(listing: IMarketItemExpanded) {
    const alert = await this.alertCtrl.create({
      header: 'Unlist Item',
      message: `Are you sure you want to unlist "${
        listing.itemData?.name || 'this item'
      }" x${listing.quantity}? You will not get your paid tax back.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Unlist',
          handler: async () => {
            this.marketService.unsellItem(listing).subscribe();
          },
        },
      ],
    });

    await alert.present();
  }
}
