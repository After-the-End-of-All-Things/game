import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { IItem } from '@interfaces';

@Component({
  selector: 'app-item-icon',
  templateUrl: './item-icon.component.html',
  styleUrls: ['./item-icon.component.scss'],
})
export class ItemIconComponent implements OnInit {
  @Input({ required: true }) item!: IItem;
  @Input() size: 'xsmall' | 'small' | 'normal' = 'normal';

  @HostBinding('class') get sizeClass() {
    return this.size;
  }

  constructor() {}

  ngOnInit() {}
}
