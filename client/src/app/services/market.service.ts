import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  constructor(private http: HttpClient) {}

  sellItem(instanceId: string, price: number) {
    return this.http.put(`${environment.apiUrl}/market/listings`, {
      instanceId,
      price,
    });
  }
}
