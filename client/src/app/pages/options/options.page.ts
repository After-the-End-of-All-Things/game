import { Component, OnInit } from '@angular/core';
import { GameOption } from '@interfaces';
import { Select, Store } from '@ngxs/store';
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

  private versionInfo: any = {
    tag: '',
    semverString: '',
    raw: 'v.local',
    hash: 'v.local',
    distance: -1,
  };

  public get version(): string {
    if (this.versionInfo.distance >= 0 && this.versionInfo.tag) {
      return `${this.versionInfo.tag} (${this.versionInfo.raw})`;
    }

    return (
      this.versionInfo.tag ||
      this.versionInfo.semverString ||
      this.versionInfo.raw ||
      this.versionInfo.hash
    );
  }

  public get contentVersion(): string {
    return (
      (localStorage.getItem('contentVersion') || '').substring(0, 8) ||
      'unknown'
    );
  }

  public get artVersion(): string {
    return (
      (localStorage.getItem('artVersion') || '').substring(0, 8) || 'unknown'
    );
  }

  constructor(private store: Store) {}

  ngOnInit() {
    this.loadVersionInfo();
  }

  async loadVersionInfo() {
    try {
      const response = await fetch('/assets/version.json');
      const json = await response.json();

      this.versionInfo = json;
    } catch {
      console.error('Could not load version information');
    }
  }

  setOption(option: string, event: any) {
    this.store.dispatch(
      new SetOption(option as GameOption, event.detail.value),
    );
  }
}
