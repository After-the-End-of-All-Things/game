import { Component, Input, OnInit } from '@angular/core';
import { ILocation, LocationStat } from '@interfaces';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-location-stats',
  templateUrl: './location-stats.component.html',
  styleUrls: ['./location-stats.component.scss'],
})
export class LocationStatsModalComponent implements OnInit {
  @Input({ required: true }) location!: ILocation;

  public readonly displayStats: LocationStat[] = [
    LocationStat.XPGain,
    LocationStat.CoinGain,
    LocationStat.ExploreSpeed,
    LocationStat.TaxRate,
    LocationStat.ItemFind,
    LocationStat.Wave,
    LocationStat.NPCEncounter,
    LocationStat.LocationFind,
    LocationStat.CollectibleFind,
    LocationStat.ResourceFind,
    LocationStat.MonsterFind,
  ];

  public readonly statNames: Record<LocationStat, string> = {
    [LocationStat.XPGain]: 'XP Gain',
    [LocationStat.CoinGain]: 'Coin Gain',
    [LocationStat.ExploreSpeed]: 'Explore Speed',
    [LocationStat.TaxRate]: 'Tax Rate',
    [LocationStat.ItemFind]: 'Item Find Chance',
    [LocationStat.Wave]: 'Wave Chance',
    [LocationStat.NPCEncounter]: 'NPC Encounter Chance',
    [LocationStat.LocationFind]: 'Location Find Chance',
    [LocationStat.CollectibleFind]: 'Collectible Find Chance',
    [LocationStat.ResourceFind]: 'Resource Find Chance',
    [LocationStat.MonsterFind]: 'Monster Find Chance',
  };

  public readonly statFormatters: Record<
    LocationStat,
    (value: number) => string
  > = {
    [LocationStat.XPGain]: this.percentageValueFormatter,
    [LocationStat.CoinGain]: this.percentageValueFormatter,
    [LocationStat.ExploreSpeed]: this.speedValueFormatter,
    [LocationStat.TaxRate]: (value) => `${value}%`,
    [LocationStat.ItemFind]: (value) => `${value}%`,
    [LocationStat.Wave]: (value) => `${value}%`,
    [LocationStat.NPCEncounter]: (value) => `${value}%`,
    [LocationStat.LocationFind]: (value) => `${value}%`,
    [LocationStat.CollectibleFind]: (value) => `${value}%`,
    [LocationStat.ResourceFind]: (value) => `${value}%`,
    [LocationStat.MonsterFind]: (value) => `${value}%`,
  };

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  rawPercentageFormatter(value: number): string {
    return `${value}%`;
  }

  percentageValueFormatter(value: number): string {
    if (value <= 25) return 'Significantly Lower';
    if (value <= 50) return 'Lower';
    if (value <= 75) return 'Somewhat Lower';
    if (value < 100) return 'Slightly Lower';

    if (value === 100) return 'Normal';

    if (value <= 125) return 'Slightly Higher';
    if (value <= 150) return 'Somewhat Higher';
    if (value <= 175) return 'Higher';
    if (value <= 200) return 'Significantly Higher';

    return `Way More (${value}%)`;
  }

  speedValueFormatter(value: number): string {
    if (value <= 25) return 'Extremely Fast';
    if (value <= 50) return 'Very Fast';
    if (value <= 75) return 'Fast';
    if (value < 100) return 'Slightly Faster';

    if (value === 100) return 'Normal';

    if (value <= 125) return 'Slightly Slower';
    if (value <= 150) return 'Slow';
    if (value <= 175) return 'Very Slow';
    if (value <= 200) return 'Extremely Slow';

    return `Unknown (${value}%)`;
  }
}
