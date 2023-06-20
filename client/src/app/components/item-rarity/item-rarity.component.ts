import { Component, Input, OnInit } from '@angular/core';
import { IItem } from '@interfaces';

@Component({
  selector: 'app-item-rarity',
  templateUrl: './item-rarity.component.html',
  styleUrls: ['./item-rarity.component.scss'],
})
export class ItemRarityComponent implements OnInit {
  @Input({ required: true }) item!: IItem;

  constructor() {}

  ngOnInit() {}
}
