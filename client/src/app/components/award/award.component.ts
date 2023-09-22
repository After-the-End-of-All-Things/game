import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.scss'],
})
export class AwardComponent implements OnInit {
  @Input() icon!: string;
  @Input() tooltip!: string;
  @Input() cssColor!: string;

  constructor() {}

  ngOnInit() {}
}
