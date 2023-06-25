import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-background-art',
  templateUrl: './background-art.component.html',
  styleUrls: ['./background-art.component.scss'],
})
export class BackgroundArtComponent implements OnInit {
  @Input({ required: true }) sprite!: string;

  constructor() {}

  ngOnInit() {}
}
