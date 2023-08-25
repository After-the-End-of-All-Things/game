import {
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Element,
  ICombatAbility,
  ICombatAbilityPattern,
  ICombatTargetParams,
  IFight,
  IFightCharacter,
  IFightTile,
  IMonster,
  IPlayer,
  IUser,
} from '@interfaces';
import { AlertController, IonModal } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { FightService } from '@services/fight.service';
import { FightStore, PlayerStore, UserStore } from '@stores';
import { ChangePage } from '@stores/user/user.actions';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.page.html',
  styleUrls: ['./combat.page.scss'],
})
export class CombatPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  @Select(PlayerStore.player) player$!: Observable<IPlayer>;
  @Select(UserStore.user) user$!: Observable<IUser>;
  @Select(FightStore.fight) fight$!: Observable<IFight>;

  @ViewChild('abilitiesModal') abilitiesModal!: IonModal;

  public readonly elements: Element[] = [
    'fire',
    'water',
    'earth',
    'air',
    'light',
    'dark',
  ];

  public fight!: IFight;
  public fightCharacters: Record<string, IFightCharacter> = {};
  public myCharacterId = '';
  public myCharacterJob = '';
  public myCharacterLevel = 0;
  public selectedAbility: ICombatAbility | undefined;
  public staticSelectedTiles: Record<string, boolean> = {};

  public get myCharacter(): IFightCharacter {
    return this.fightCharacters[this.myCharacterId];
  }

  public get isMyCharacterActive(): boolean {
    return this.fight.currentTurn === this.myCharacterId;
  }

  public get defenders(): IFightCharacter[] {
    return this.fight.defenders.map((character) => {
      return this.fightCharacters[character.characterId];
    });
  }

  constructor(
    private store: Store,
    private contentService: ContentService,
    private fightService: FightService,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() {
    combineLatest([this.user$, this.player$, this.fight$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([user, player, fight]) => {
        if (!fight) {
          this.store.dispatch(new ChangePage('home'));
          return;
        }

        this.fight = fight;

        this.fightCharacters = {};
        [...fight.attackers, ...fight.defenders].forEach((character) => {
          this.fightCharacters[character.characterId] = character;

          if (character.userId === user.id) {
            this.myCharacterId = character.characterId;
          }
        });

        this.myCharacterJob = player.job;
        this.myCharacterLevel = player.level;
      });
  }

  getMonster(id: string): IMonster {
    return this.contentService.getMonster(id) as IMonster;
  }

  getAbilities(): ICombatAbility[] {
    const itemAbilities = [
      this.contentService.getAbilityByName('Unarmed Attack'),
      ...Object.values(this.myCharacter.equipment)
        .filter(Boolean)
        .map((item) => {
          return (item.abilities ?? [])
            .map((ability) => this.contentService.getAbility(ability))
            .flat();
        })
        .flat(),
    ];

    const jobAbilities = Object.values(this.contentService.abilities).filter(
      (ability) => {
        return (
          ability.requiredJob === this.myCharacterJob &&
          ability.requiredLevel <= this.myCharacterLevel
        );
      },
    );

    return [...itemAbilities, ...jobAbilities].filter(
      Boolean,
    ) as ICombatAbility[];
  }

  selectAbility(ability: ICombatAbility) {
    this.selectedAbility = ability;
    this.staticSelectedTiles = {};

    this.abilitiesModal.dismiss();

    this.chooseSelectedTiles(ability);
  }

  findTileWithCharacter(characterId: string): [number, number] | undefined {
    let foundTile: [number, number] | undefined;

    this.fight.tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile.containedCharacters.includes(characterId)) {
          foundTile = [x, y];
        }
      });
    });

    return foundTile;
  }

  choosePatternAroundCenter(
    x: number,
    y: number,
    pattern: ICombatAbilityPattern,
  ): Record<string, boolean> {
    const staticSelectedTiles: Record<string, boolean> = {};

    switch (pattern) {
      case 'Single': {
        staticSelectedTiles[`${x}-${y}`] = true;
        return staticSelectedTiles;
      }

      case 'Cross': {
        staticSelectedTiles[`${x}-${y}`] = true;
        staticSelectedTiles[`${x - 1}-${y}`] = true;
        staticSelectedTiles[`${x + 1}-${y}`] = true;
        staticSelectedTiles[`${x}-${y - 1}`] = true;
        staticSelectedTiles[`${x}-${y + 1}`] = true;
        return staticSelectedTiles;
      }

      case 'CrossNoCenter': {
        staticSelectedTiles[`${x - 1}-${y}`] = true;
        staticSelectedTiles[`${x + 1}-${y}`] = true;
        staticSelectedTiles[`${x}-${y - 1}`] = true;
        staticSelectedTiles[`${x}-${y + 1}`] = true;
        return staticSelectedTiles;
      }

      case 'ThreeVertical': {
        staticSelectedTiles[`${x}-${y}`] = true;
        staticSelectedTiles[`${x}-${y - 1}`] = true;
        staticSelectedTiles[`${x}-${y + 1}`] = true;
        return staticSelectedTiles;
      }

      case 'TwoHorizontal': {
        staticSelectedTiles[`${x}-${y}`] = true;
        staticSelectedTiles[`${x + 1}-${y}`] = true;
        return staticSelectedTiles;
      }

      default:
        return pattern satisfies never;
    }
  }

  drawPatternAroundCenter(
    x: number,
    y: number,
    pattern: ICombatAbilityPattern,
  ) {
    const patternTiles = this.choosePatternAroundCenter(x, y, pattern);
    this.staticSelectedTiles = { ...this.staticSelectedTiles, ...patternTiles };
  }

  chooseSelectedTiles(ability: ICombatAbility) {
    switch (ability.targetting) {
      case 'Self': {
        const center = this.findTileWithCharacter(this.myCharacterId);
        if (!center) return;

        this.drawPatternAroundCenter(center[0], center[1], ability.pattern);
        return;
      }

      case 'Creature': {
        this.defenders.forEach((defender) => {
          const center = this.findTileWithCharacter(defender.characterId);
          if (!center) return;

          this.drawPatternAroundCenter(center[0], center[1], ability.pattern);
        });
        return;
      }
    }
  }

  selectTilesOnHover(hoverTileX: number, hoverTileY: number) {
    if (!this.selectedAbility || this.selectedAbility.targetting !== 'Ground')
      return;

    this.resetSelectedTiles();
    this.drawPatternAroundCenter(
      hoverTileX,
      hoverTileY,
      this.selectedAbility.pattern,
    );
  }

  resetAbilityAndSelection() {
    this.resetAbility();
    this.resetSelectedTiles();
  }

  resetAbility() {
    this.selectedAbility = undefined;
  }

  resetSelectedTiles() {
    this.staticSelectedTiles = {};
  }

  isTileActive(x: number, y: number) {
    if (!this.selectedAbility) return false;

    const tileKey = `${x}-${y}`;
    return this.staticSelectedTiles[tileKey];
  }

  clickTile(tile: IFightTile, x: number, y: number) {
    if (!this.selectedAbility) return;

    if (this.isTileActive(x, y)) {
      const targetArgs =
        this.selectedAbility.targetting === 'Ground'
          ? { tile: { x, y } }
          : { characterId: tile.containedCharacters[0] };

      this.fightService
        .takeAction(this.selectedAbility.itemId, targetArgs)
        .subscribe();
    }

    this.resetAbilityAndSelection();
  }

  startMoving() {
    const moveAction = this.contentService.getAbilityByName('Move');
    if (!moveAction) return;

    this.selectAbility(moveAction);
  }

  finalizeAction(targetParams: ICombatTargetParams) {
    const action = this.selectedAbility;
    if (!action) return;

    this.fightService.takeAction(action.itemId, targetParams).subscribe();
    this.resetAbility();
    this.resetSelectedTiles();
  }

  async flee() {
    const confirm = await this.alertCtrl.create({
      header: 'Confirm Flee',
      message: `Are you sure you want to flee this combat?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Flee',
          handler: async () => {
            const fleeAction = this.contentService.getAbilityByName('Flee');
            if (!fleeAction) return;

            this.fightService.takeAction(fleeAction.itemId, {}).subscribe();
          },
        },
      ],
    });

    await confirm.present();
  }
}
