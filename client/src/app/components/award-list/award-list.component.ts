import { Component, Input, OnInit } from '@angular/core';
import { IPlayer, IUser } from '@interfaces';

@Component({
  selector: 'app-award-list',
  templateUrl: './award-list.component.html',
  styleUrls: ['./award-list.component.scss'],
})
export class AwardListComponent implements OnInit {
  @Input() user!: Partial<IUser>;
  @Input() player!: Partial<IPlayer>;

  constructor() {}

  ngOnInit() {}
}
