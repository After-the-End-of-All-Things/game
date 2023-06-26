import { Component, Input, OnInit } from '@angular/core';
import { IEquipment, IItem } from '@interfaces';

@Component({
  selector: 'app-item-elements',
  templateUrl: './item-elements.component.html',
  styleUrls: ['./item-elements.component.scss'],
})
export class ItemElementsComponent implements OnInit {
  public elements: string[] = [];

  @Input({ required: true }) item!: IItem;

  constructor() {}

  ngOnInit() {
    const elements = [
      ...((this.item as IEquipment).attackElements || []),
      ...((this.item as IEquipment).defenseElements || []),
    ];

    this.elements = elements;
  }
}
