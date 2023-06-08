import { Component, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Store } from '@ngxs/store';

import { get } from 'lodash';

@Component({
  selector: 'app-store-text',
  templateUrl: './store-text.component.html',
  styleUrls: ['./store-text.component.scss'],
})
export class StoreTextComponent {

  @Input({ required: true }) storeKey!: string;

  public displayedText = '';

  constructor(private store: Store) {
    this.store.select(store => get(store, this.storeKey, this.storeKey))
      .pipe(takeUntilDestroyed())
      .subscribe((res: any) => {
        this.displayedText = res;
      });
  }

}
