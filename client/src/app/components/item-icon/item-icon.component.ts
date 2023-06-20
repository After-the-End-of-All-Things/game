import { Component, Input, OnInit } from '@angular/core';
import { IItem } from '@interfaces';

@Component({
  selector: 'app-item-icon',
  templateUrl: './item-icon.component.html',
  styleUrls: ['./item-icon.component.scss'],
})
export class ItemIconComponent implements OnInit {
  @Input({ required: true }) item!: IItem;
  @Input() scale = 1;

  constructor() {}

  ngOnInit() {}
}
