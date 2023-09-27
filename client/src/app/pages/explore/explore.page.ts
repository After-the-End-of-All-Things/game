import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IFight, INotificationAction, IPlayerLocation } from '@interfaces';
import { AlertController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { ActionsService } from '@services/actions.service';
import { ContentService } from '@services/content.service';
import { GameplayService } from '@services/gameplay.service';
import { VisualService } from '@services/visual.service';
import { FightStore, PlayerStore } from '@stores';
import { ChangePage } from '@stores/user/user.actions';
import { Observable, first, timer } from 'rxjs';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  private destroyRef = inject(DestroyRef);

  public canExplore = false;
  public firstPositiveNumber = 0;
  public nextExploreTime = 0;
  public exploreResponseTime = 0;

  @Select(PlayerStore.exploreCooldown) exploreCooldown$!: Observable<number>;
  @Select(PlayerStore.playerLocation)
  playerLocation$!: Observable<IPlayerLocation>;
  @Select(PlayerStore.playerAction)
  playerAction$!: Observable<INotificationAction>;
  @Select(FightStore.fight) fight$!: Observable<IFight>;

  constructor(
    private store: Store,
    private alertCtrl: AlertController,
    private gameplayService: GameplayService,
    private contentService: ContentService,
    public actionsService: ActionsService,
    public visualService: VisualService,
  ) {}

  ngOnInit() {
    this.fight$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fight) => {
      if (!fight) return;

      this.store.dispatch(new ChangePage('combat'));
    });

    this.playerLocation$.pipe(first()).subscribe((location) => {
      this.canExplore = location.cooldown < Date.now();
    });
  }

  private startExploreLoop(start: number, end: number) {
    const numSeconds = end - start;

    const timer$ = timer(0, 100).subscribe((iter) => {
      const timeElapsed = iter * 100;
      this.nextExploreTime = timeElapsed / numSeconds;

      if (timeElapsed >= numSeconds) {
        timer$.unsubscribe();
        this.canExplore = true;
      }
    });
  }

  explore() {
    this.canExplore = false;

    this.gameplayService.explore().subscribe((data) => {
      const cooldownStartPatch = (data as any).player.find(
        (patch: any) => patch.path === '/location/cooldownStart',
      );
      const cooldownPatch = (data as any).player.find(
        (patch: any) => patch.path === '/location/cooldown',
      );
      if (!cooldownStartPatch || !cooldownPatch) return;

      const cooldownStart = cooldownStartPatch.value;
      const cooldown = cooldownPatch.value;

      this.startExploreLoop(cooldownStart, cooldown);
    });
  }

  getMonster(monsterId: string) {
    return this.contentService.getMonster(monsterId)!;
  }

  async confirmClassChange(action: INotificationAction) {
    const alert = await this.alertCtrl.create({
      header: 'Change Job',
      message: `Are you sure you want to change your job to ${action.actionData.newJob}? Your equipment will switch to that jobs equipment and you will change your level to that jobs level (level 1 if you have not been that job).`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes, Change',
          handler: async () => {
            this.actionsService.doAction(action);
          },
        },
      ],
    });

    await alert.present();
  }
}
