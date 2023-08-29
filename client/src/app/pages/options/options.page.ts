import { Component, OnInit } from '@angular/core';
import { GameOption } from '@interfaces';
import { Select, Store } from '@ngxs/store';
import { MetaService } from '@services/meta.service';
import { OptionsStore } from '@stores';
import { SetOption } from '@stores/options/options.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {
  @Select(OptionsStore.options) options$!: Observable<
    Record<GameOption, number | string>
  >;

  constructor(private store: Store, public metaService: MetaService) {}

  ngOnInit() {}

  setOption(option: string, event: any) {
    this.store.dispatch(
      new SetOption(option as GameOption, event.detail.value),
    );
  }
}
