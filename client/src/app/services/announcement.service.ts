import { Injectable } from '@angular/core';

import Parser from 'rss-parser/dist/rss-parser';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private allAnnouncements: any[] = [];

  private async init() {
    const parser = new Parser();
    try {
      const feed = await parser.parseURL('https://blog.ateoat.com/feed.xml');

      this.allAnnouncements = feed.items;
    } catch {
      console.error('Could not fetch announcements.');
    }
  }

  public async getLatestAnnouncement() {
    await this.init();

    const announcement = this.allAnnouncements[0];
    if (!announcement) {
      return {};
    }

    return {
      title: announcement.title,
      link: announcement.link,
      author: announcement.author,
      summary: announcement.summary,
    };
  }
}
