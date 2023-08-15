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
    LocationStat.TaxRate,
    LocationStat.ExploreSpeed,
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
    [LocationStat.ItemFind]: 'Item Find Chance',
    [LocationStat.Wave]: 'Wave Chance',
    [LocationStat.NPCEncounter]: 'NPC Encounter Chance',
    [LocationStat.LocationFind]: 'Location Find Chance',
    [LocationStat.CollectibleFind]: 'Collectible Find Chance',
    [LocationStat.ResourceFind]: 'Resource Find Chance',
    [LocationStat.MonsterFind]: 'Monster Find Chance',
    [LocationStat.TaxRate]: 'Tax Rate',
  };

  public readonly statFormatters: Record<
    LocationStat,
    (value: number) => string
  > = {
    [LocationStat.XPGain]: (value) => `${value}%`,
    [LocationStat.CoinGain]: (value) => `${value}%`,
    [LocationStat.ExploreSpeed]: (value) => `${value}%`,
    [LocationStat.ItemFind]: (value) => `${value}%`,
    [LocationStat.Wave]: (value) => `${value}%`,
    [LocationStat.NPCEncounter]: (value) => `${value}%`,
    [LocationStat.LocationFind]: (value) => `${value}%`,
    [LocationStat.CollectibleFind]: (value) => `${value}%`,
    [LocationStat.ResourceFind]: (value) => `${value}%`,
    [LocationStat.MonsterFind]: (value) => `${value}%`,
    [LocationStat.TaxRate]: (value) => `${value}%`,
  };

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }
}
