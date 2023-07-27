import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CompareItemsModalComponent } from '@components/modals/compare-items/compare-items.component';
import { itemValue } from '@helpers/item';
import {
  AllAccessories,
  AllArmor,
  AllWeapons,
  Armor,
  ICollectible,
  IDiscoveries,
  IEquipment,
  IItem,
  IPlayer,
  ItemSlot,
  LocationStat,
  Weapon,
} from '@interfaces';
import { AlertController, ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { GameplayService } from '@services/gameplay.service';
import { MarketService } from '@services/market.service';
import { PlayerService } from '@services/player.service';
import { UserService } from '@services/user.service';
import { InventoryStore, PlayerStore } from '@stores';
import { UpdateInventoryItems } from '@stores/inventory/inventory.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @Select(PlayerStore.player) player$!: Observable<IPlayer>;
  @Select(InventoryStore.equipped) equipped$!: Observable<
    Record<ItemSlot, IEquipment>
  >;
  @Select(InventoryStore.items) items$!: Observable<IItem[]>;

  public readonly basicEquipTypes = AllArmor;

  public readonly weaponEquipTypes = AllWeapons;

  public readonly accessoryEquipTypes = AllAccessories;

  public items: IItem[] = [];
  public discoveries!: IDiscoveries;

  constructor(
    private store: Store,
    private alertCtrl: AlertController,
    public playerService: PlayerService,
    public contentService: ContentService,
    private modalController: ModalController,
    private gameplayService: GameplayService,
    private marketService: MarketService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.watchItems();

    this.updateItems();
    this.updateDiscoveries();
  }

  updateItems() {
    this.store.dispatch(new UpdateInventoryItems());
  }

  watchItems() {
    this.items$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((items) => {
      this.items = items;
    });
  }

  updateDiscoveries() {
    this.userService.getDiscoveries().subscribe(({ discoveries }: any) => {
      this.discoveries = discoveries;
    });
  }

  getStatsForItem(item: IItem) {
    return (item as IEquipment).stats || {};
  }

  getElementsForItem(item: IItem) {
    return [
      ...((item as IEquipment).attackElements || []),
      ...((item as IEquipment).defenseElements || []),
    ];
  }

  getValueForItem(item: IItem) {
    return itemValue(item);
  }

  valueComparison(vA: unknown, vB: unknown, itemA: IItem, itemB: IItem) {
    return itemValue(itemB) - itemValue(itemA);
  }

  sellItem(item: IItem) {
    if (!item.instanceId) return;

    this.gameplayService.sellItem(item.instanceId).subscribe(() => {});
  }

  async listItem(item: IItem) {
    const alert = await this.alertCtrl.create({
      header: 'Sell Item',
      message: 'Enter the price you want to sell this item for.',
      inputs: [
        {
          name: 'price',
          type: 'number',
          placeholder: 'Price',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Sell',
          handler: async ({ price }) => {
            if (!item.instanceId) return;

            this.store
              .selectOnce(PlayerStore.player)
              .subscribe(async (player) => {
                const location = player.location.current;
                const locationData = this.contentService.getLocation(location);
                if (!locationData) return;

                const realPrice = Math.floor(price);

                const taxPrice = Math.floor(
                  realPrice *
                    (locationData.baseStats[LocationStat.TaxRate] / 100),
                );

                const confirm = await this.alertCtrl.create({
                  header: 'Confirm Sale',
                  message: `Are you sure you want to list this item for ${realPrice.toLocaleString()} coins? It will cost ${taxPrice.toLocaleString()} coins to list.`,
                  buttons: [
                    {
                      text: 'Cancel',
                      role: 'cancel',
                    },
                    {
                      text: 'List',
                      handler: async () => {
                        if (!item.instanceId) return;

                        this.marketService
                          .sellItem(item.instanceId, realPrice)
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

  discoverCollectible(item: ICollectible) {
    if (!item.instanceId) return;

    this.gameplayService
      .discoverCollectible(item.instanceId)
      .subscribe(() => {});
  }

  discoverEquipment(item: IEquipment) {
    if (!item.instanceId) return;

    this.gameplayService.discoverEquipment(item.instanceId).subscribe(() => {});
  }

  isDiscovered(item: IItem) {
    if (!this.discoveries) return false;

    return (
      this.discoveries.collectibles?.[item.itemId] ||
      this.discoveries.items?.[item.itemId]
    );
  }

  getEquippedItem(
    slot: ItemSlot | string,
    equipment?: Record<ItemSlot, IEquipment>,
  ): IEquipment | undefined {
    return equipment?.[slot as ItemSlot];
  }

  canEquipItem(player: unknown, item: IEquipment) {
    const playerRef = player as IPlayer;
    const playerJob = this.contentService.getJob(playerRef.job);
    return (
      playerRef.level >= item.levelRequirement &&
      (playerJob?.armorSlots[item.type as Armor] ||
        playerJob?.weapons[item.type as Weapon])
    );
  }

  canEquipWeapon(player: unknown, item: IEquipment) {
    const job = (player as IPlayer).job;
    const jobRef = this.contentService.getJob(job);
    if (!jobRef) return false;

    return jobRef.weapons[item.type as Weapon] > 0;
  }

  canEquipArmor(player: unknown, item: IEquipment) {
    const job = (player as IPlayer).job;
    const jobRef = this.contentService.getJob(job);
    if (!jobRef) return false;

    return jobRef.armorSlots[item.type as Armor];
  }

  private async compareItems(
    item1: IItem,
    item2: IItem | undefined,
    success: () => void,
  ) {
    const modal = await this.modalController.create({
      component: CompareItemsModalComponent,
      componentProps: {
        item1,
        item2,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      success();
    }
  }

  equipArmor(item: IEquipment, currentItem?: IEquipment) {
    this.compareItems(item, currentItem, () => {
      this.gameplayService
        .equipItem(item.type as Armor, item.instanceId ?? '')
        .subscribe(() => {
          this.updateItems();
        });
    });
  }

  equipWeapon(item: IEquipment, currentItem?: IEquipment) {
    this.compareItems(item, currentItem, () => {
      this.gameplayService
        .equipItem('weapon', item.instanceId ?? '')
        .subscribe(() => {
          this.updateItems();
        });
    });
  }

  equipAccessory(item: IEquipment, slot: number, currentItem?: IEquipment) {
    this.compareItems(item, currentItem, () => {
      this.gameplayService
        .equipItem(`accessory${slot as 1 | 2 | 3}`, item.instanceId ?? '')
        .subscribe(() => {
          this.updateItems();
        });
    });
  }
}
