import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { IMarketItem, IMarketItemExpanded, IPagination } from '@interfaces';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private claimedCoins = new BehaviorSubject(false);
  public claimedCoins$ = this.claimedCoins.asObservable();

  constructor(private http: HttpClient) {}

  getItems(filters: any, getMyItems = false) {
    const params = Object.keys(filters).reduce((prev, key) => {
      if (!filters[key]) return prev;
      return prev.set(key, filters[key]);
    }, new HttpParams());

    return this.http.get<IPagination<IMarketItem>>(
      `${environment.apiUrl}/market/${getMyItems ? 'listings' : 'items'}`,
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
    return this.http
      .post(`${environment.apiUrl}/market/listings/claims`, {})
      .pipe(tap(() => this.claimedCoins.next(true)));
  }

  repriceItem(listing: IMarketItemExpanded, price: number) {
    return this.http.patch(
      `${environment.apiUrl}/market/listings/${listing.internalId}`,
      { price },
    );
  }

  unsellItem(listing: IMarketItemExpanded) {
    return this.http.delete(
      `${environment.apiUrl}/market/listings/${listing.internalId}`,
    );
  }
}
