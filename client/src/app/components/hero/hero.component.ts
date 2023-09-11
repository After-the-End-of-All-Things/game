import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  @Input() public background = -1;
  @Input({ required: true }) public portrait!: number;
  @Input({ required: true }) public level!: number;
  @Input({ required: true }) public job!: string;

  @Input({ required: true }) public username!: string;
  @Input({ required: true }) public discriminator!: string;

  @Input() public tagline = '';

  @Input() public showCurrencies = false;
  @Input() public coins!: number;
  @Input() public oats!: number;

  ngOnInit() {}
}
