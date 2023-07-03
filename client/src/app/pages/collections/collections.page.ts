import { Component, OnInit } from '@angular/core';
import { IDiscoveries } from '@interfaces';
import { Select } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { GameplayService } from '@services/gameplay.service';
import { UserService } from '@services/user.service';
import { DiscoveriesStore } from '@stores';
import { sum } from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage implements OnInit {
  @Select(DiscoveriesStore.discoveries) discoveries$!: Observable<IDiscoveries>;

  public readonly collectibleUniqueMax = 10;
  public readonly collectibleTotalMax = 100;

  public readonly equipmentUniqueMax = 100;
  public readonly equipmentTotalMax = 1000;

  public selectedCategory = 'collectibles';

  public readonly allPortraits = Array(this.contentService.maxPortraits)
    .fill(0)
    .map((_, i) => i + 1);

  public readonly allBackgrounds = Array(this.contentService.maxBackgrounds)
    .fill(0)
    .map((_, i) => i + 1);

  public readonly allCollectibles = this.contentService.getAllCollectibles();
  public readonly allEquipment = this.contentService.getAllEquipment();

  public unlocked: Partial<Record<keyof IDiscoveries, number>> = {
    collectibles: 0,
    backgrounds: 0,
    borders: 0,
    items: 0,
    locations: 0,
    portraits: 0,
  };

  public totals: Partial<Record<keyof IDiscoveries, number>> = {
    collectibles: 0,
    backgrounds: 0,
    borders: 0,
    items: 0,
    locations: 0,
    portraits: 0,
  };

  private discoveries!: IDiscoveries;

  constructor(
    private userService: UserService,
    private gameplayService: GameplayService,
    public contentService: ContentService,
  ) {}

  ngOnInit() {
    this.userService.getDiscoveries().subscribe(({ discoveries }: any) => {
      this.discoveries = discoveries;

      Object.keys(discoveries).forEach((key) => {
        if (!this.unlocked.hasOwnProperty(key)) return;

        this.unlocked[key as keyof IDiscoveries] = Object.keys(
          discoveries[key],
        ).length;

        this.totals[key as keyof IDiscoveries] = sum(
          Object.values(discoveries[key]),
        );
      });
    });
  }

  trackBy(index: number) {
    return index;
  }

  selectCategory(event: any) {
    this.selectedCategory = event.detail.value;
  }

  canClaimTotalCollectible(): boolean {
    return this.getTotalCollectibleClaimNumber() >= this.collectibleTotalMax;
  }

  canClaimUniqueCollectible(): boolean {
    return this.getUniqueCollectibleClaimNumber() >= this.collectibleUniqueMax;
  }

  canClaimTotalEquipment(): boolean {
    return this.getTotalEquipmentClaimNumber() >= this.equipmentTotalMax;
  }

  canClaimUniqueEquipment(): boolean {
    return this.getUniqueEquipmentClaimNumber() >= this.equipmentUniqueMax;
  }

  getTotalCollectibleClaimNumber(): number {
    return (
      (this.totals.collectibles ?? 0) -
      (this.discoveries?.totalCollectibleClaims ?? 0) * this.collectibleTotalMax
    );
  }

  getUniqueCollectibleClaimNumber(): number {
    return (
      (this.unlocked.collectibles ?? 0) -
      (this.discoveries?.uniqueCollectibleClaims ?? 0) *
        this.collectibleUniqueMax
    );
  }

  getTotalEquipmentClaimNumber(): number {
    return (
      (this.totals.items ?? 0) -
      (this.discoveries?.totalEquipmentClaims ?? 0) * this.equipmentTotalMax
    );
  }

  getUniqueEquipmentClaimNumber(): number {
    return (
      (this.unlocked.items ?? 0) -
      (this.discoveries?.uniqueEquipmentClaims ?? 0) * this.equipmentUniqueMax
    );
  }

  claimCollectiblesUnique() {
    this.gameplayService.claimCollectibleUnique().subscribe();
  }

  claimCollectiblesTotal() {
    this.gameplayService.claimCollectibleTotal().subscribe();
  }

  claimEquipmentUnique() {
    this.gameplayService.claimEquipmentUnique().subscribe();
  }

  claimEquipmentTotal() {
    this.gameplayService.claimEquipmentTotal().subscribe();
  }
}
