import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  @Input({ required: true }) endsAt = 0;

  public currentTimer = Date.now();

  private get duration() {
    return Math.max(0, this.endsAt - this.currentTimer);
  }

  public get days() {
    return Math.floor(this.totalSeconds / 60 / 60 / 24);
  }

  public get hours() {
    return Math.floor(this.totalSeconds / 60 / 60) % 24;
  }

  public get minutes() {
    return Math.floor(this.totalSeconds / 60) % 60;
  }

  public get seconds() {
    return this.totalSeconds % 60;
  }

  public get totalSeconds() {
    return Math.floor(this.duration / 1000);
  }

  constructor() {}

  ngOnInit() {
    timer(0, 500)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentTimer = Date.now();
      });
  }
}
