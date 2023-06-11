import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(private http: HttpClient) {}

  changePortrait(portrait: number) {
    this.http
      .patch(`${environment.apiUrl}/player/cosmetics/portrait`, { portrait })
      .subscribe();
  }
}
