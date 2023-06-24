import { Component, OnInit } from '@angular/core';
import { IEquipment, IItem } from '@interfaces';
import { ContentService } from '@services/content.service';
import { PlayerService } from '@services/player.service';

import { itemValue } from '@helpers/item';
import { Store } from '@ngxs/store';
import { GameplayService } from '@services/gameplay.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  public items: IItem[] = [];

  constructor(
    private store: Store,
    public playerService: PlayerService,
    public contentService: ContentService,
    private gameplayService: GameplayService,
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

  sellItem(item: IItem, index: number) {
    if (!item.instanceId) return;

    this.gameplayService.sellItem(item.instanceId).subscribe(() => {
      this.items = this.items.filter((i) => i !== item);
    });
  }
}
