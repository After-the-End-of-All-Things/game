import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { IMonster } from '@interfaces';

@Component({
  selector: 'app-monster-icon',
  templateUrl: './monster-icon.component.html',
  styleUrls: ['./monster-icon.component.scss'],
})
export class MonsterIconComponent implements OnInit {
  @Input({ required: true }) monster!: IMonster;
  @Input() size: 'xsmall' | 'small' | 'normal' = 'normal';

  @HostBinding('class') get sizeClass() {
    return this.size;
  }

  constructor() {}

  ngOnInit() {}
}
