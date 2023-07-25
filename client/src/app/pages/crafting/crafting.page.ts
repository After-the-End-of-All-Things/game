import { Component, OnInit } from '@angular/core';
import { xpForCraftingLevel } from '@helpers/xp';
import { IDiscoveries, IItem, IRecipe, RecipeType } from '@interfaces';
import { AlertController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { GameplayService } from '@services/gameplay.service';
import { UserService } from '@services/user.service';
import { CraftingStore, InventoryStore } from '@stores';
import { ClearNotificationActionsMatchingUrl } from '@stores/notifications/notifications.actions';
import { Observable, first, forkJoin } from 'rxjs';

@Component({
  selector: 'app-crafting',
  templateUrl: './crafting.page.html',
  styleUrls: ['./crafting.page.scss'],
})
export class CraftingPage implements OnInit {
  @Select(InventoryStore.resources) resources$!: Observable<
    Record<string, number>
  >;

  @Select(CraftingStore.currentlyCrafting) currentlyCrafting$!: Observable<{
    item: string;
    endsAt: number;
  }>;

  @Select(CraftingStore.armorer) armorer$!: Observable<{
    level: number;
    xp: number;
  }>;
  @Select(CraftingStore.artisan) artisan$!: Observable<{
    level: number;
    xp: number;
  }>;
  @Select(CraftingStore.smith) smith$!: Observable<{
    level: number;
    xp: number;
  }>;

  public availableResources: Record<string, number> = {};
  public discipline: RecipeType = 'armorer';

  public recipes: Array<IRecipe & { item: IItem | undefined }> = [];
  public discoveries!: IDiscoveries;

  constructor(
    private store: Store,
    private alert: AlertController,
    private gameplayService: GameplayService,
    private contentService: ContentService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    forkJoin({
      armorer: this.armorer$.pipe(first()),
      artisan: this.artisan$.pipe(first()),
      smith: this.smith$.pipe(first()),
    }).subscribe((data) => {
      this.selectDiscipline({ detail: { value: this.discipline } }, data);
    });
    this.updateDiscoveries();

    this.resources$.pipe(first()).subscribe((resources) => {
      this.availableResources = resources;
    });
  }

  updateDiscoveries() {
    this.userService.getDiscoveries().subscribe(({ discoveries }: any) => {
      this.discoveries = discoveries;
    });
  }

  selectDiscipline(
    ev: any,
    craftData: Record<RecipeType, { level: number; xp: number } | null>,
  ) {
    this.discipline = ev.detail.value as RecipeType;

    this.recipes = this.contentService
      .getRecipes()
      .filter((recipe) => recipe.type === this.discipline)
      .filter(
        (recipe) =>
          recipe.requiredLevel <= (craftData[this.discipline]?.level ?? 1),
      )
      .map((recipe) => ({
        ...recipe,
        item: this.contentService.getItem(recipe.resultingItem),
      }));
  }

  isDiscovered(item: IItem) {
    if (!this.discoveries) return false;

    return (
      this.discoveries.collectibles?.[item.itemId] ||
      this.discoveries.items?.[item.itemId]
    );
  }

  getItemById(id: string) {
    return this.contentService.getItem(id);
  }

  async craft(recipe: IRecipe) {
    const realItem = this.contentService.getItem(recipe.resultingItem);
    if (!realItem) return;

    const alert = await this.alert.create({
      header: 'Crafting',
      message: `Are you sure you want to craft ${
        realItem.name
      }? It will take ${recipe.craftTime.toLocaleString()} seconds to finish and cannot be canceled.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Craft',
          handler: () => {
            this.gameplayService.craftItem(recipe.resultingItem).subscribe();
          },
        },
      ],
    });

    await alert.present();
  }

  collect() {
    this.gameplayService
      .takeCraftedItem()
      .subscribe(() =>
        this.store.dispatch(
          new ClearNotificationActionsMatchingUrl('gameplay/item/craft/take'),
        ),
      );
  }

  canCraft(recipe: IRecipe) {
    return recipe.ingredients.every(
      (ing) => this.availableResources[ing.item] >= ing.amount,
    );
  }

  isStillCrafting(endTime: number) {
    return Date.now() < endTime;
  }

  nextCraftingLevelXp(level: number) {
    return xpForCraftingLevel(level);
  }
}
