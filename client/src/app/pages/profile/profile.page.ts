import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPlayer } from '@interfaces';
import { PlayerService } from '@services/player.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @Input() id!: string;

  public player: IPlayer = {
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
  } as unknown as IPlayer;

  public stats: Array<{ name: string; value: string }> = [];

  constructor(private router: Router, private playerService: PlayerService) {}

  ngOnInit() {
    if (!this.id) {
      this.leave();
      return;
    }

    this.playerService.getPlayerProfile(this.id).subscribe((player) => {
      if (!player) {
        this.leave();
        return;
      }

      this.player = player as IPlayer;
    });

    this.playerService.getPlayerStats(this.id).subscribe((stats) => {
      this.stats = stats as Array<{ name: string; value: string }>;
    });
  }

  private leave() {
    this.router.navigate(['/me']);
  }
}
