import { Component, OnInit } from '@angular/core';
import { ChooseAvatarModalComponent } from '@components/modals/choose-avatar/choose-avatar.component';
import { ChooseBackgroundComponent } from '@components/modals/choose-background/choose-background.component';
import { xpForLevel } from '@helpers/xp';
import {
  ICombatAbility,
  IEquipment,
  IPlayer,
  ItemSlot,
  Stat,
} from '@interfaces';
import { AlertController, ModalController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { AuthService } from '@services/auth.service';
import { ContentService } from '@services/content.service';
import { PlayerService } from '@services/player.service';
import { UserService } from '@services/user.service';
import { InventoryStore, PlayerStore, UserStore } from '@stores';
import { sum } from 'lodash';
import { LocalStorage } from 'ngx-webstorage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {
  @Select(UserStore.email) email$!: Observable<string>;
  @Select(UserStore.emailVerified) emailVerified$!: Observable<boolean>;
  @Select(PlayerStore.player) player$!: Observable<IPlayer>;
  @Select(InventoryStore.equipped) equipment$!: Observable<
    Record<ItemSlot, IEquipment>
  >;

  @LocalStorage() view!: 'stats' | 'abilities' | 'levels';

  public dailyReset!: Date;

  public readonly stats = [
    {
      name: 'HP',
      tooltip: 'Your total health. When it hits 0, you die.',
      stat: Stat.Health,
    },
    {
      name: 'Power',
      tooltip:
        'How much damage you do on physical hits. Reduced by the targets Toughness.',
      stat: Stat.Power,
    },
    {
      name: 'Toughness',
      tooltip: 'How much physical damage you resist. Reduces incoming Power.',
      stat: Stat.Toughness,
    },
    {
      name: 'Special',
      tooltip: 'Used for special attacks. Not typically overcome by anything.',
      stat: Stat.Special,
    },
    {
      name: 'Magic',
      tooltip:
        'How much damage you do on magical hits. Reduced by the targets Resistance.',
      stat: Stat.Magic,
    },
    {
      name: 'Resistance',
      tooltip: 'How much magical damage you resist. Reduces incoming Magic.',
      stat: Stat.Resistance,
    },
  ];

  constructor(
    private modal: ModalController,
    private alert: AlertController,
    private contentService: ContentService,
    private playerService: PlayerService,
    public authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    if (!this.view) this.view = 'stats';

    this.userService.dailyReset().subscribe((reset) => {
      this.dailyReset = new Date(reset as string);
      this.dailyReset.setDate(this.dailyReset.getDate() + 1);
    });
  }

  changeView($event: any) {
    this.view = $event.detail.value;
  }

  async changePortrait(defaultPortrait: number) {
    const modal = await this.modal.create({
      component: ChooseAvatarModalComponent,
      componentProps: {
        defaultPortrait,
      },
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data >= 0 && data !== defaultPortrait) {
      this.playerService.changePortrait(data);
    }
  }

  async changeBackground(defaultBackground: number) {
    const modal = await this.modal.create({
      component: ChooseBackgroundComponent,
      componentProps: {
        defaultBackground,
      },
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data >= -1) {
      this.playerService.changeBackground(data);
    }
  }

  calcStat(
    player: IPlayer,
    equipment: Record<ItemSlot, IEquipment>,
    stat: Stat,
  ) {
    const job = this.contentService.getJob(player.job);
    if (!job) return 0;

    const total = sum(
      Object.values(equipment)
        .filter(Boolean)
        .map((item) => item.stats[stat] ?? 0),
    );

    return total + Math.floor(job.statGainsPerLevel[stat] * player.level);
  }

  getMainNumber(value: number) {
    return Math.floor(value);
  }

  getSubNumber(value: number) {
    return (value - Math.floor(value)).toFixed(1).substring(1);
  }

  async changeShortBio(defaultValue: string) {
    const alert = await this.alert.create({
      header: 'Change Tagline',
      inputs: [
        {
          placeholder: 'Tagline',
          type: 'textarea',
          value: defaultValue,
          attributes: {
            maxlength: 30,
          },
        },
      ],
      buttons: [
        {
          role: 'cancel',
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: (data: any) => {
            const newTagline = data[0];
            this.playerService.changeShortBio(newTagline);
          },
        },
      ],
    });

    await alert.present();
  }

  async changeLongBio(defaultValue: string) {
    const alert = await this.alert.create({
      header: 'Change Bio',
      inputs: [
        {
          placeholder: 'Bio',
          type: 'textarea',
          value: defaultValue,
          attributes: {
            maxlength: 500,
          },
        },
      ],
      buttons: [
        {
          role: 'cancel',
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: (data: any) => {
            const newBio = data[0];
            this.playerService.changeLongBio(newBio);
          },
        },
      ],
    });

    await alert.present();
  }

  jobLevels(
    player: IPlayer,
  ): Array<{ name: string; level: number; xp: number; nextXp: number }> {
    return [
      {
        name: player.job,
        level: player.level,
        xp: player.xp,
        nextXp: this.nextLevelXp(player.level),
      },
      ...Object.keys(player.otherJobLevels || {}).map((job) => {
        return {
          name: job,
          level: player.otherJobLevels[job],
          xp: player.otherJobXp[job],
          nextXp: this.nextLevelXp(player.otherJobLevels[job]),
        };
      }),
    ];
  }

  getBasicAbilities(
    player: IPlayer,
    equipment: Record<ItemSlot, IEquipment>,
  ): ICombatAbility[] {
    const itemAbilities = [
      this.contentService.getAbilityByName('Unarmed Attack'),
      this.contentService.getAbilityByName('Move'),
      this.contentService.getAbilityByName('Flee'),
    ];

    return [...itemAbilities].filter(Boolean) as ICombatAbility[];
  }

  getWeaponAbilities(
    player: IPlayer,
    equipment: Record<ItemSlot, IEquipment>,
  ): ICombatAbility[] {
    const itemAbilities = [
      ...Object.values(equipment)
        .filter(Boolean)
        .map((item) => {
          return (item.abilities ?? [])
            .map((ability) => this.contentService.getAbility(ability))
            .flat();
        })
        .flat(),
    ];

    return [...itemAbilities].filter(Boolean) as ICombatAbility[];
  }

  getJobAbilities(
    player: IPlayer,
    equipment: Record<ItemSlot, IEquipment>,
  ): ICombatAbility[] {
    const jobAbilities = Object.values(this.contentService.abilities).filter(
      (ability) => {
        return (
          ability.requiredJob === player.job &&
          ability.requiredLevel <= player.level
        );
      },
    );

    return [...jobAbilities].filter(Boolean) as ICombatAbility[];
  }

  nextLevelXp(level: number) {
    return xpForLevel(level + 1);
  }

  trackBy(index: number) {
    return index;
  }

  async requestVerificationCode() {
    this.authService.requestVerificationCode().subscribe();

    const alert = await this.alert.create({
      header: 'Enter Verification Code',
      message: `Please enter your verification code.`,
      inputs: [
        {
          name: 'code',
          type: 'text',
          placeholder: 'Code',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Submit Code',
          handler: async ({ code }) => {
            if (!code) return;

            this.authService.verifyVerificationCode(code).subscribe();
          },
        },
      ],
    });

    await alert.present();
  }

  async changePassword() {
    const alert = await this.alert.create({
      header: 'Enter New Password',
      message: `Please enter your new password.`,
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Submit Password',
          handler: async ({ password }) => {
            if (!password) return;

            this.authService.changePassword(password).subscribe();
          },
        },
      ],
    });

    await alert.present();
  }

  async changeEmail() {
    const alert = await this.alert.create({
      header: 'Enter New Email',
      message: `Please enter your new email address. This will remove your verified status and require you to verify your email again.`,
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email Address',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Submit Email',
          handler: async ({ email }) => {
            if (!email) return;

            this.authService.changeEmail(email).subscribe();
          },
        },
      ],
    });

    await alert.present();
  }
}
