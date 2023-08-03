import { Component, Input, OnInit } from '@angular/core';
import { IEquipment, IItem, Stat } from '@interfaces';

@Component({
  selector: 'app-item-stats',
  templateUrl: './item-stats.component.html',
  styleUrls: ['./item-stats.component.scss'],
})
export class ItemStatsComponent implements OnInit {
  public stats: Array<{ key: string; value: number }> = [];

  @Input({ required: true }) item!: IItem;

  constructor() {}

  ngOnInit() {
    const stats = (this.item as IEquipment).stats || {};

    Object.keys(stats).forEach((key) => {
      if (!stats[key as Stat]) return;
      this.stats.push({ key, value: stats[key as Stat] });
    });
  }
}
