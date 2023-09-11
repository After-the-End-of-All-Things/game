import { Component, Input, OnInit } from '@angular/core';
import { IItem } from '@interfaces';
import { ContentService } from '@services/content.service';

@Component({
  selector: 'app-item-display',
  templateUrl: './item-display.component.html',
  styleUrls: ['./item-display.component.scss'],
})
export class ItemDisplayComponent implements OnInit {
  @Input({ required: true }) itemId!: string;

  public item!: IItem | undefined;

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.item = this.contentService.getItem(this.itemId);
  }
}
