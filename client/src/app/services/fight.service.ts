import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { ICombatTargetParams } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class FightService {
  constructor(private http: HttpClient) {}

  takeAction(actionId: string, targetParams: ICombatTargetParams) {
    return this.http.post(`${environment.apiUrl}/fight/action`, {
      actionId,
      targetParams,
    });
  }
}
