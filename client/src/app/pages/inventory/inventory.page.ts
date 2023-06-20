import { Component, OnInit } from '@angular/core';
import { IEquipment, IItem } from '@interfaces';
import { ContentService } from '@services/content.service';
import { PlayerService } from '@services/player.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  public items: IItem[] = [];

  constructor(
    public playerService: PlayerService,
    public contentService: ContentService,
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
}
