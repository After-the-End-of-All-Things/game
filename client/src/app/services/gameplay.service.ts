import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root',
})
export class GameplayService {
  constructor(private http: HttpClient) {}

  explore() {
    return this.http.post(`${environment.apiUrl}/gameplay/explore`, {});
  }
}
