import { Component, OnInit } from '@angular/core';
import { itemValue } from '@helpers/item';
import { IItem, IPlayer, IResource, LocationStat } from '@interfaces';
import { AlertController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { MarketService } from '@services/market.service';
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
  private resourceHash: Record<string, number> = {};

  constructor(
    private store: Store,
    private alertCtrl: AlertController,
    private marketService: MarketService,
    public contentService: ContentService,
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.updateItems();
  }

  updateItems() {
    this.resources$.subscribe((resources) => {
      this.resourceHash = resources;

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

  async listItem(item: IItem) {
    const alert = await this.alertCtrl.create({
      header: 'Sell Item',
      message:
        'Enter the price you want to sell this item for, and the quantity of that resource to sell.',
      inputs: [
        {
          name: 'price',
          type: 'number',
          placeholder: 'Price (per item)',
          value: itemValue(item),
          min: itemValue(item),
        },
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Quantity',
          value: 1,
          min: 1,
          max: this.resourceHash[item.itemId],
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Sell',
          handler: async ({ price, quantity }) => {
            this.store
              .selectOnce(PlayerStore.player)
              .subscribe(async (player) => {
                const location = player.location.current;
                const locationData = this.contentService.getLocation(location);
                if (!locationData) return;

                const realQuantity = Math.floor(
                  Math.max(
                    0,
                    Math.min(quantity, this.resourceHash[item.itemId]),
                  ),
                );

                const realPrice = Math.floor(price);
                const realPriceQtyAdjusted = Math.floor(
                  realPrice * realQuantity,
                );

                const taxPrice = Math.max(
                  1,
                  Math.floor(
                    realPriceQtyAdjusted *
                      (locationData.baseStats[LocationStat.TaxRate] / 100),
                  ),
                );

                const confirm = await this.alertCtrl.create({
                  header: 'Confirm Sale',
                  message: `Are you sure you want to list this item for ${realPrice.toLocaleString()} coins each (${realPriceQtyAdjusted.toLocaleString()} coins total)? It will cost ${taxPrice.toLocaleString()} coins to list ${realQuantity.toLocaleString()} of them.`,
                  buttons: [
                    {
                      text: 'Cancel',
                      role: 'cancel',
                    },
                    {
                      text: 'List',
                      handler: async () => {
                        this.marketService
                          .sellItem(item.itemId, realPrice, realQuantity)
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
}
