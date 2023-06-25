import { Component, OnInit } from '@angular/core';
import { IDiscoveries } from '@interfaces';
import { Select } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { UserService } from '@services/user.service';
import { DiscoveriesStore } from '@stores';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage implements OnInit {
  @Select(DiscoveriesStore.discoveries) discoveries$!: Observable<IDiscoveries>;

  public selectedCategory = 'collectibles';

  public readonly allPortraits = Array(this.contentService.maxPortraits)
    .fill(0)
    .map((_, i) => i + 1);

  public readonly allBackgrounds = Array(this.contentService.maxBackgrounds)
    .fill(0)
    .map((_, i) => i + 1);

  public readonly allCollectibles = this.contentService.getAllCollectibles();
  public readonly allEquipment = this.contentService.getAllEquipment();

  constructor(
    private userService: UserService,
    private contentService: ContentService,
  ) {}

  ngOnInit() {
    this.userService.getDiscoveries().subscribe();
  }

  trackBy(index: number) {
    return index;
  }

  selectCategory(event: any) {
    this.selectedCategory = event.detail.value;
  }
}
