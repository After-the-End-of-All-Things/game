import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(private http: HttpClient) {}

  getInventoryItems() {
    return this.http.get(`${environment.apiUrl}/inventory/items`);
  }

  changePortrait(portrait: number) {
    this.http
      .patch(`${environment.apiUrl}/discoveries/cosmetics/portrait`, {
        portrait,
      })
      .subscribe();
  }

  changeShortBio(shortbio: string) {
    this.http
      .patch(`${environment.apiUrl}/player/profile/shortbio`, { shortbio })
      .subscribe();
  }

  changeLongBio(longbio: string) {
    this.http
      .patch(`${environment.apiUrl}/player/profile/longbio`, { longbio })
      .subscribe();
  }
}
