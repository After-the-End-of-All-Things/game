import { IInventoryStore } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { applyPatch } from 'fast-json-patch';
import { ApplyInventoryPatches, SetInventory } from './inventory.actions';

export const defaultStore: () => IInventoryStore = () => ({
  version: 0,
  inventory: {
    inventory: {},
    equippedItems: {
      head: undefined,
      body: undefined,
      legs: undefined,
      feet: undefined,
      shoulders: undefined,
      waist: undefined,
      weapon: undefined,
      accessory1: undefined,
      accessory2: undefined,
      accessory3: undefined,
    },
  },
});

export function setInventory(
  ctx: StateContext<IInventoryStore>,
  { inventory }: SetInventory,
) {
  ctx.patchState({ inventory });
}

export function applyInventoryPatches(
  ctx: StateContext<IInventoryStore>,
  { patches }: ApplyInventoryPatches,
) {
  const inventory = ctx.getState().inventory;

  applyPatch(inventory, patches);

  ctx.patchState({ inventory });
}
