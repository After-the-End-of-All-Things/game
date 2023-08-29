import { Component, OnInit } from '@angular/core';
import { MetaService } from '@services/meta.service';
import { marked } from 'marked';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.page.html',
  styleUrls: ['./updates.page.scss'],
})
export class UpdatesPage implements OnInit {
  public mode = 'current';

  public changelog = '';

  constructor(public metaService: MetaService) {}

  ngOnInit() {
    this.selectCategory({ detail: { value: 'current' } });
  }

  selectCategory(event: any) {
    this.mode = event.detail.value;

    const parseString =
      this.mode === 'current'
        ? this.metaService.changelogCurrent
        : this.metaService.changelogFull;

    const renderer = new marked.Renderer();
    renderer.link = (href, title, text) =>
      `<a href="${href}" title="${title}" target="_blank" rel="noopener noreferrer">${text}</a>`;

    this.changelog = marked(parseString, { renderer });
  }
}
