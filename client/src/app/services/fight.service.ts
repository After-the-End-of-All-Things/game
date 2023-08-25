import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { ICombatTargetParams } from '@interfaces';
import { Store } from '@ngxs/store';
import { GrabData } from '@stores/user/user.actions';

@Injectable({
  providedIn: 'root',
})
export class FightService {
  private fightEvents!: EventSource;

  constructor(private store: Store, private http: HttpClient) {}

  init() {
    this.initEvents();
  }

  initEvents() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.fightEvents = new EventSource(
      `${environment.apiUrl}/fight/sse/${token}`,
    );

    this.fightEvents.onmessage = (data) => {
      if (!data.data) return;

      const grabData = JSON.parse(data.data);
      this.store.dispatch(new GrabData(grabData));
    };
  }

  takeAction(actionId: string, targetParams: ICombatTargetParams) {
    return this.http.post(`${environment.apiUrl}/fight/action`, {
      actionId,
      targetParams,
    });
  }
}
