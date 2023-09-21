import { Component, OnInit } from '@angular/core';
import { OOCBuff } from '@interfaces';
import { Select } from '@ngxs/store';
import { GameplayService } from '@services/gameplay.service';
import { PlayerStore } from '@stores';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-worship',
  templateUrl: './worship.page.html',
  styleUrls: ['./worship.page.scss'],
})
export class WorshipPage implements OnInit {
  @Select(PlayerStore.playerWorship) public playerWorship$!: Observable<{
    cooldown: number;
    buffs: Record<OOCBuff, number>;
  }>;

  public deities = [
    {
      name: 'Buibui',
      buff: OOCBuff.Coins,
      color: '#ffd700',
      description:
        'Pray to a generous deity to gain a 15% coin boost for 1 hour.',
    },
    {
      name: 'Eindew',
      buff: OOCBuff.XP,
      color: '#C4a484',
      description:
        'Pray to an experienced deity to gain a 15% XP boost for 1 hour.',
    },
    {
      name: "Gra'chl",
      buff: OOCBuff.Defense,
      color: '#6cb4ee',
      description:
        'Pray to a protective deity to gain a 15% defense boost for 1 hour.',
    },
    {
      name: 'Parthe',
      buff: OOCBuff.TravelSpeed,
      color: '#17b169',
      description:
        'Pray to an expeditious deity to gain a 20% travel speed boost for 1 hour.',
    },
    {
      name: 'Ruspoo',
      buff: OOCBuff.Offense,
      color: '#ef0107',
      description:
        'Pray to a powerful deity to gain a 15% attack boost for 1 hour.',
    },
    {
      name: 'Spoodles',
      buff: OOCBuff.Nothing,
      color: '#f0f',
      description: 'Pray to a mysterious deity.',
    },
  ];

  constructor(public gameplayService: GameplayService) {}

  ngOnInit() {}

  isTimeActive(timestamp: number): boolean {
    return timestamp > Date.now();
  }

  worshipDeity(deity: OOCBuff) {
    this.gameplayService.worship(deity).subscribe();
  }
}
