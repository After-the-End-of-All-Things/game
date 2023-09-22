import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPlayer, IUser } from '@interfaces';
import { PlayerService } from '@services/player.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @Input() id!: string;

  public isLoading = false;
  public isError = false;

  private player: Partial<IPlayer> & Partial<IUser> = {
    cosmetics: {
      background: -1,
      portrait: 0,
      showcase: {
        collectibles: [],
        items: [],
      },
    },
    profile: {
      displayName: '',
      discriminator: '',
      longBio: '',
      shortBio: '',
    },
    emailVerified: false,
  };

  public get playerRef(): IPlayer {
    return this.player as IPlayer;
  }

  public get userRef(): IUser {
    return this.player as IUser;
  }

  public stats: Array<{ name: string; value: string }> = [];

  constructor(private router: Router, private playerService: PlayerService) {}

  ngOnInit() {
    if (!this.id) {
      this.leave();
      return;
    }

    this.isLoading = true;

    forkJoin([
      this.playerService.getPlayerProfile(this.id),
      this.playerService.getPlayerStats(this.id),
    ]).subscribe(([player, stats]) => {
      if (!player) {
        this.leave();
        return;
      }

      const playerRef = player as IPlayer;

      if (!playerRef.cosmetics.showcase) {
        this.isError = true;
        this.isLoading = false;
        return;
      }

      this.player = playerRef;
      this.stats = stats as Array<{ name: string; value: string }>;

      this.isLoading = false;
    });
  }

  private leave() {
    this.router.navigate(['/me']);
  }

  jobLevels(player: IPlayer): Array<{ name: string; level: number }> {
    return [
      {
        name: player.job,
        level: player.level,
      },
      ...Object.keys(player.otherJobLevels || {}).map((job) => {
        return {
          name: job,
          level: player.otherJobLevels[job],
        };
      }),
    ];
  }
}
