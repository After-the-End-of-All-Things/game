import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IDiscoveries, IPlayerShowcase } from '@interfaces';
import { Select } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { GameplayService } from '@services/gameplay.service';
import { PlayerService } from '@services/player.service';
import { DiscoveriesStore, PlayerStore } from '@stores';
import { sum } from 'lodash';
import { Observable, first } from 'rxjs';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage {
  private destroyRef = inject(DestroyRef);
  @Select(DiscoveriesStore.discoveries) discoveries$!: Observable<IDiscoveries>;
  @Select(PlayerStore.playerShowcase) showcase$!: Observable<IPlayerShowcase>;

  public readonly collectibleUniqueMax = 10;
  public readonly collectibleTotalMax = 100;

  public readonly equipmentUniqueMax = 100;
  public readonly equipmentTotalMax = 1000;

  public readonly monstersUniqueMax = 25;
  public readonly monstersTotalMax = 250;

  public selectedCategory = 'collectibles';

  public readonly allPortraits = Array(this.contentService.maxPortraits)
    .fill(0)
    .map((_, i) => i);

  public readonly allBackgrounds = Array(this.contentService.maxBackgrounds)
    .fill(0)
    .map((_, i) => i);

  public readonly allCollectibles = this.contentService.getAllCollectibles();
  public readonly allEquipment = this.contentService.getAllEquipment();
  public readonly allMonsters = this.contentService.getAllMonsters();

  public unlocked: Partial<Record<keyof IDiscoveries, number>> = {
    collectibles: 0,
    backgrounds: 0,
    borders: 0,
    items: 0,
    monsters: 0,
    locations: 0,
    portraits: 0,
  };

  public totals: Partial<Record<keyof IDiscoveries, number>> = {
    collectibles: 0,
    backgrounds: 0,
    borders: 0,
    items: 0,
    monsters: 0,
    locations: 0,
    portraits: 0,
  };

  private discoveries!: IDiscoveries;

  constructor(
    private gameplayService: GameplayService,
    public contentService: ContentService,
    private playerService: PlayerService,
  ) {}

  ionViewDidEnter() {
    this.discoveries$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((discoveries) => {
        this.discoveries = discoveries;

        Object.keys(discoveries).forEach((key) => {
          if (!this.unlocked.hasOwnProperty(key)) return;

          this.unlocked[key as keyof IDiscoveries] = Object.keys(
            discoveries[key as keyof IDiscoveries],
          ).length;

          this.totals[key as keyof IDiscoveries] = sum(
            Object.values(discoveries[key as keyof IDiscoveries]),
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

  canClaimTotalMonsters(): boolean {
    return this.getTotalMonstersClaimNumber() >= this.monstersTotalMax;
  }

  canClaimUniqueMonsters(): boolean {
    return this.getUniqueMonstersClaimNumber() >= this.monstersUniqueMax;
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

  getTotalMonstersClaimNumber(): number {
    return (
      (this.totals.monsters ?? 0) -
      (this.discoveries?.totalMonsterClaims ?? 0) * this.monstersTotalMax
    );
  }

  getUniqueMonstersClaimNumber(): number {
    return (
      (this.unlocked.monsters ?? 0) -
      (this.discoveries?.uniqueMonsterClaims ?? 0) * this.monstersUniqueMax
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

  claimMonstersUnique() {
    this.gameplayService.claimMonstersUnique().subscribe();
  }

  claimMonstersTotal() {
    this.gameplayService.claimMonstersTotal().subscribe();
  }

  showcaseCollectible(itemId: string) {
    this.showcase$.pipe(first()).subscribe((showcase) => {
      const collectibles = showcase.collectibles || [];
      const index = collectibles.findIndex((c) => c === itemId);
      const setValue = index === -1 ? itemId : undefined;
      const setIndex = index === -1 ? collectibles.length : index;

      this.playerService.changeShowcaseCollectible(setValue, setIndex);
    });
  }

  showcaseItem(itemId: string) {
    this.showcase$.pipe(first()).subscribe((showcase) => {
      const items = showcase.items || [];
      const index = items.findIndex((c) => c === itemId);
      const setValue = index === -1 ? itemId : undefined;
      const setIndex = index === -1 ? items.length : index;

      this.playerService.changeShowcaseItem(setValue, setIndex);
    });
  }
}
