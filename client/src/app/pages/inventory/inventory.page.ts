import { Component, OnInit } from '@angular/core';
import {
  Armor,
  ICollectible,
  IDiscoveries,
  IEquipment,
  IItem,
  IPlayer,
  ItemSlot,
  Weapon,
} from '@interfaces';
import { ContentService } from '@services/content.service';
import { PlayerService } from '@services/player.service';

import { CompareItemsModalComponent } from '@components/modals/compare-items/compare-items.component';
import { itemValue } from '@helpers/item';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { GameplayService } from '@services/gameplay.service';
import { UserService } from '@services/user.service';
import { InventoryStore, PlayerStore } from '@stores';
import { Observable } from 'dexie';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;
  @Select(InventoryStore.equipped) equipped$!: Observable<
    Record<ItemSlot, IEquipment>
  >;

  public readonly basicEquipTypes = [
    'body',
    'feet',
    'head',
    'legs',
    'shoulders',
    'waist',
  ];

  public readonly weaponEquipTypes = [
    'axe',
    'bow',
    'dagger',
    'fist',
    'gun',
    'mace',
    'spear',
    'staff',
    'sword',
  ];

  public readonly accessoryEquipTypes = [
    'jewelry',
    'wrist',
    'hands',
    'ammo',
    'back',
  ];

  public items: IItem[] = [];
  public discoveries!: IDiscoveries;

  constructor(
    private store: Store,
    public playerService: PlayerService,
    public contentService: ContentService,
    private modalController: ModalController,
    private gameplayService: GameplayService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.updateItems();
    this.updateDiscoveries();
  }

  updateItems() {
    this.playerService.getInventoryItems().subscribe((res: any) => {
      this.items = res.items
        .filter((i: any) => !i.isInUse)
        .map((i: any) => ({
          ...this.contentService.getItem(i.itemId),
          instanceId: i.instanceId,
        })) as IItem[];
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

    this.gameplayService.sellItem(item.instanceId).subscribe(() => {
      this.items = this.items.filter((i) => i !== item);
    });
  }

  discoverCollectible(item: ICollectible) {
    if (!item.instanceId) return;

    this.gameplayService.discoverCollectible(item.instanceId).subscribe(() => {
      this.items = this.items.filter((i) => i !== item);
    });
  }

  discoverEquipment(item: IEquipment) {
    if (!item.instanceId) return;

    this.gameplayService.discoverEquipment(item.instanceId).subscribe(() => {
      this.items = this.items.filter((i) => i !== item);
    });
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
