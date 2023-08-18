import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() avatar = 4;
  @Input() padding = 32;
  @Input() noScale = false;
  @Input() size: 'normal' | 'small' = 'normal';

  constructor() {}

  ngOnInit() {}
}
