import { Component, Input, OnInit } from '@angular/core';
import { Element } from '@interfaces';

@Component({
  selector: 'app-element-icon',
  templateUrl: './element-icon.component.html',
  styleUrls: ['./element-icon.component.scss'],
})
export class ElementIconComponent implements OnInit {
  @Input({ required: true }) element!: Element;
  @Input() count = 0;
  @Input() colored = true;
  @Input() inline = false;

  public countArray: number[] = [];

  constructor() {}

  ngOnInit() {
    this.countArray = Array(this.count);
  }

  ngOnChanges() {
    this.countArray = Array(this.count);
  }
}
