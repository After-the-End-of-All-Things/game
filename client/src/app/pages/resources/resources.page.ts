import { Component, OnInit } from '@angular/core';
import { itemValue } from '@helpers/item';
import { IItem, IPlayer, IResource } from '@interfaces';
import { Select } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { PlayerService } from '@services/player.service';
import { InventoryStore, PlayerStore } from '@stores';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
})
export class ResourcesPage implements OnInit {
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;
  @Select(InventoryStore.resources) resources$!: Observable<
    Record<string, number>
  >;

  public items: IResource[] = [];

  constructor(
    private playerService: PlayerService,
    public contentService: ContentService,
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.updateItems();
  }

  updateItems() {
    this.resources$.subscribe((resources) => {
      this.items = Object.keys(resources).map((i: any) => ({
        ...this.contentService.getResource(i),
        quantity: resources[i],
      })) as IResource[];
    });
  }

  getValueForItem(item: IResource) {
    return itemValue(item);
  }

  valueComparison(vA: unknown, vB: unknown, itemA: IItem, itemB: IItem) {
    return itemValue(itemB) - itemValue(itemA);
  }
}
