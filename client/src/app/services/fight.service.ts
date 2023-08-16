import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root',
})
export class FightService {
  private fightEvents!: EventSource;

  constructor() {}

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

      console.log('FIGHT DATA', data);
    };
  }
}
