import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-icon',
  templateUrl: './game-icon.component.html',
  styleUrls: ['./game-icon.component.scss'],
})
export class GameIconComponent implements OnInit {
  @Input({ required: true }) icon!: string;
  @Input() color = '';
  @Input() cssColor = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  constructor() {}

  ngOnInit() {}
}
