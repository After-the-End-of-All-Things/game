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
  public locationSprite = -1;

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
          this.store.dispatch(new ChangePage('explore'));
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

        this.locationSprite =
          this.contentService.getLocation(player.location.current)
            ?.background ?? -1;
      });
  }

  getMonster(id: string): IMonster {
    return this.contentService.getMonster(id) as IMonster;
  }

  getMonsterLetter(character: IFightCharacter): string {
    if (!character.monsterId) return '';
    return character.name.split(' ').pop() as string;
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
    if (this.myCharacter.cooldowns[ability.itemId] > 0) return;

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

  drawPatternAroundCenter(x: number, y: number, ability: ICombatAbility) {
    const patternTiles = this.choosePatternAroundCenter(x, y, ability.pattern);
    this.staticSelectedTiles = { ...this.staticSelectedTiles, ...patternTiles };

    if (ability.restrictToUserSide) {
      for (let x = 4; x < 8; x++)
        for (let y = 0; y < 4; y++)
          delete this.staticSelectedTiles[`${x}-${y}`];
    }
  }

  chooseSelectedTiles(ability: ICombatAbility) {
    switch (ability.targetting) {
      case 'Self': {
        const center = this.findTileWithCharacter(this.myCharacterId);
        if (!center) return;

        this.drawPatternAroundCenter(center[0], center[1], ability);
        return;
      }

      case 'Creature': {
        const shouldTargetOnlyFirstColumn = ability.targetInOrder;

        if (shouldTargetOnlyFirstColumn) {
          let hasFoundAnyone = false;

          for (let x = 4; x < 8; x++) {
            if (hasFoundAnyone) break;

            for (let y = 0; y < 4; y++) {
              const tile = this.fight.tiles[y][x];
              const areContainedDead = tile.containedCharacters.every(
                (c) => this.fightCharacters[c].health.current <= 0,
              );
              if (areContainedDead || tile.containedCharacters.length === 0)
                continue;

              hasFoundAnyone = true;
              this.drawPatternAroundCenter(x, y, ability);
            }
          }
          return;
        }

        this.defenders.forEach((defender) => {
          if (defender.health.current <= 0) return;

          const center = this.findTileWithCharacter(defender.characterId);
          if (!center) return;

          this.drawPatternAroundCenter(center[0], center[1], ability);
        });
        return;
      }
    }
  }

  selectTilesOnHover(hoverTileX: number, hoverTileY: number) {
    if (!this.selectedAbility || this.selectedAbility.targetting !== 'Ground')
      return;

    this.resetSelectedTiles();
    this.drawPatternAroundCenter(hoverTileX, hoverTileY, this.selectedAbility);
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
        this.selectedAbility.targetting === 'Creature'
          ? { characterIds: tile.containedCharacters }
          : { tile: { x, y } };

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
