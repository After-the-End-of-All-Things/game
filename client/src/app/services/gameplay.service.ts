import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { ItemSlot } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameplayService {
  constructor(private http: HttpClient) {}

  explore() {
    return this.http.post(`${environment.apiUrl}/gameplay/explore`, {});
  }

  walk(location: string) {
    return this.http.post(`${environment.apiUrl}/gameplay/walk`, {
      location,
    });
  }

  travel(location: string) {
    return this.http.post(`${environment.apiUrl}/gameplay/travel`, {
      location,
    });
  }

  sellItem(instanceId: string) {
    return this.http.post(`${environment.apiUrl}/gameplay/item/sell`, {
      instanceId,
    });
  }

  discoverCollectible(instanceId: string) {
    return this.http.post(
      `${environment.apiUrl}/discoveries/discover/collectible`,
      {
        instanceId,
      },
    );
  }

  discoverEquipment(instanceId: string) {
    return this.http.post(
      `${environment.apiUrl}/discoveries/discover/equipment`,
      {
        instanceId,
      },
    );
  }

  claimCollectibleUnique() {
    return this.http.post(
      `${environment.apiUrl}/discoveries/claim/unique/collectible`,
      {},
    );
  }

  claimCollectibleTotal() {
    return this.http.post(
      `${environment.apiUrl}/discoveries/claim/total/collectible`,
      {},
    );
  }

  claimEquipmentUnique() {
    return this.http.post(
      `${environment.apiUrl}/discoveries/claim/unique/equipment`,
      {},
    );
  }

  claimEquipmentTotal() {
    return this.http.post(
      `${environment.apiUrl}/discoveries/claim/total/equipment`,
      {},
    );
  }

  claimMonstersUnique() {
    return this.http.post(
      `${environment.apiUrl}/discoveries/claim/unique/monsters`,
      {},
    );
  }

  claimMonstersTotal() {
    return this.http.post(
      `${environment.apiUrl}/discoveries/claim/total/monsters`,
      {},
    );
  }

  equipItem(slot: ItemSlot, instanceId: string) {
    return this.http.patch(
      `${environment.apiUrl}/gameplay/item/equip/${slot}`,
      {
        slot,
        instanceId,
      },
    );
  }

  craftItem(itemId: string) {
    return this.http.put(`${environment.apiUrl}/gameplay/item/craft/start`, {
      itemId,
    });
  }

  takeCraftedItem() {
    return this.http.post(`${environment.apiUrl}/gameplay/item/craft/take`, {});
  }
}
