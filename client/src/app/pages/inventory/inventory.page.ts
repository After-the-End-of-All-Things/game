import { Component, OnInit } from '@angular/core';
import {
  Armor,
  ICollectible,
  IDiscoveries,
  IEquipment,
  IItem,
  IPlayer,
  Weapon,
} from '@interfaces';
import { ContentService } from '@services/content.service';
import { PlayerService } from '@services/player.service';

import { itemValue } from '@helpers/item';
import { Select, Store } from '@ngxs/store';
import { GameplayService } from '@services/gameplay.service';
import { UserService } from '@services/user.service';
import { PlayerStore } from '@stores';
import { Observable } from 'dexie';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;

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

  // job check, job check, job check, level check
  canEquipItem(player: unknown, item: IEquipment) {
    return (player as IPlayer).level >= item.levelRequirement;
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

  equipArmor(item: IEquipment) {
    this.gameplayService
      .equipItem(item.type as Armor, item.instanceId ?? '')
      .subscribe(() => {
        this.updateItems();
      });
  }

  equipWeapon(item: IEquipment) {
    this.gameplayService
      .equipItem('weapon', item.instanceId ?? '')
      .subscribe(() => {
        this.updateItems();
      });
  }

  equipAccessory(item: IEquipment, slot: number) {
    this.gameplayService
      .equipItem(`accessory${slot as 1 | 2 | 3}`, item.instanceId ?? '')
      .subscribe(() => {
        this.updateItems();
      });
  }
}
