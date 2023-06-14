import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ILocation, IPlayer } from '@interfaces';
import { Select } from '@ngxs/store';
import { ContentService } from '@services/content.service';
import { PlayerStore } from '@stores';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-town',
  templateUrl: './town.page.html',
  styleUrls: ['./town.page.scss'],
})
export class TownPage implements OnInit {
  private destroyRef = inject(DestroyRef);

  public locationInfo: ILocation | undefined;

  @Select(PlayerStore.player) player$!: Observable<IPlayer>;

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.player$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((player) => {
        this.locationInfo = this.contentService.getLocation(
          player.location.current
        );
      });
  }
}
