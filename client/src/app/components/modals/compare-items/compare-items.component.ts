import { Component, Input, OnInit } from '@angular/core';
import { IEquipment, Stat } from '@interfaces';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-compare-items',
  templateUrl: './compare-items.component.html',
  styleUrls: ['./compare-items.component.scss'],
})
export class CompareItemsModalComponent implements OnInit {
  @Input() item1!: IEquipment;
  @Input() item2!: IEquipment | undefined;
  @Input() canEquip = true;

  public commonStats: Stat[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const stats = new Set<string>();
    Object.keys(this.item1.stats).forEach((stat) => stats.add(stat));

    if (this.item2) {
      Object.keys(this.item2.stats).forEach((stat) => stats.add(stat));
    }

    this.commonStats = Array.from(stats).sort() as Stat[];
  }

  dismiss(value?: any) {
    this.modalCtrl.dismiss(value);
  }

  getStatClassBetweenItems(
    stat: Stat,
    item1: IEquipment,
    item2?: IEquipment,
  ): string {
    if (!item2) return 'higher';

    if (item1.stats[stat] > (item2.stats[stat] ?? 0)) return 'higher';
    if (item1.stats[stat] < item2.stats[stat]) return 'lower';

    return '';
  }
}
