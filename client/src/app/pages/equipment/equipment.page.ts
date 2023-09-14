import { Component, OnInit } from '@angular/core';
import { IInventory, ItemSlot } from '@interfaces';
import { Select } from '@ngxs/store';
import { GameplayService } from '@services/gameplay.service';
import { InventoryStore } from '@stores';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.page.html',
  styleUrls: ['./equipment.page.scss'],
})
export class EquipmentPage implements OnInit {
  @Select(InventoryStore.inventory) inventory$!: Observable<IInventory>;

  public readonly armorSlots: Array<{ name: string; slot: ItemSlot }> = [
    {
      name: 'Weapon',
      slot: 'weapon',
    },
    {
      name: 'Head',
      slot: 'head',
    },
    {
      name: 'Shoulders',
      slot: 'shoulders',
    },
    {
      name: 'Body',
      slot: 'body',
    },
    {
      name: 'Waist',
      slot: 'waist',
    },
    {
      name: 'Legs',
      slot: 'legs',
    },
    {
      name: 'Feet',
      slot: 'feet',
    },
  ];

  public readonly accessorySlots: Array<{
    name: string;
    slot: ItemSlot;
  }> = [
    {
      name: 'Accessory 1',
      slot: 'accessory1',
    },
    {
      name: 'Accessory 2',
      slot: 'accessory2',
    },
    {
      name: 'Accessory 3',
      slot: 'accessory3',
    },
  ];

  constructor(private gameplayService: GameplayService) {}

  ngOnInit() {}

  unequipItem(slot: ItemSlot, instanceId: string) {
    this.gameplayService.unequipItem(slot, instanceId).subscribe();
  }
}
