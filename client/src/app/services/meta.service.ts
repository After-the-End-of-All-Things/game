import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private versionInfo: any = {
    tag: '',
    semverString: '',
    raw: 'v.local',
    hash: 'v.local',
    distance: -1,
  };

  private changelogAll = '';
  private changelogNow = '';

  public get changelogFull() {
    return this.changelogAll;
  }

  public get changelogCurrent() {
    return this.changelogNow;
  }

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

  constructor() {}

  async init() {
    await this.loadVersionInfo();
    await this.loadChangelogAll();
    await this.loadChangelogCurrent();
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

  async loadChangelogAll() {
    try {
      const response = await fetch('/assets/CHANGELOG.md');
      const text = await response.text();

      this.changelogAll = text;
    } catch {
      console.error('Could not load changelog all information');
    }
  }

  async loadChangelogCurrent() {
    try {
      const response = await fetch('/assets/CHANGELOG-current.md');
      const text = await response.text();

      this.changelogNow = text;
    } catch {
      console.error('Could not load changelog current information');
    }
  }
}
