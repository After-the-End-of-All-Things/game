import { Component, OnInit } from '@angular/core';
import { ICollectible, IDiscoveries, IEquipment, IItem } from '@interfaces';
import { ContentService } from '@services/content.service';
import { PlayerService } from '@services/player.service';

import { itemValue } from '@helpers/item';
import { Store } from '@ngxs/store';
import { GameplayService } from '@services/gameplay.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
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

    this.userService.getDiscoveries().subscribe(({ discoveries }: any) => {
      this.discoveries = discoveries;
    });
  }

  getStatsForItem(item: IItem) {
    return (item as IEquipment).stats || {};
  }

  getElementsForItem(item: IItem) {
    return (item as IEquipment).elements || [];
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
}
