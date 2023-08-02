import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { IMarketItem, IPagination } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  constructor(private http: HttpClient) {}

  getItems(filters: any) {
    const params = Object.keys(filters).reduce((prev, key) => {
      if (!filters[key]) return prev;
      return prev.set(key, filters[key]);
    }, new HttpParams());

    return this.http.get<IPagination<IMarketItem>>(
      `${environment.apiUrl}/market/items`,
      {
        params,
      },
    );
  }

  sellItem(instanceId: string, price: number, quantity = 1) {
    return this.http.put(`${environment.apiUrl}/market/listings`, {
      instanceId,
      price,
      quantity,
    });
  }

  buyItem(listingId: string) {
    return this.http.post(
      `${environment.apiUrl}/market/listings/${listingId}/buy`,
      {},
    );
  }

  getClaimCoins() {
    return this.http.get(`${environment.apiUrl}/market/listings/claims`);
  }

  claimCoins() {
    return this.http.post(`${environment.apiUrl}/market/listings/claims`, {});
  }
}
