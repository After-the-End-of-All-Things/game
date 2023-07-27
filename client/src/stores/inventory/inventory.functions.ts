import { IAttachmentHelpers, IInventoryStore, IItem } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { patch, removeItem } from '@ngxs/store/operators';
import { applyPatch } from 'fast-json-patch';
import {
  ApplyInventoryPatches,
  RemoveInventoryItem,
  SetInventory,
  UpdateInventoryItems,
} from './inventory.actions';

export const defaultStore: () => IInventoryStore = () => ({
  version: 0,
  inventory: {
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
    resources: {},
  },
  items: [],
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

export function updateInventoryItems(
  ctx: StateContext<IInventoryStore>,
  event: UpdateInventoryItems,
  helpers?: IAttachmentHelpers,
) {
  if (!helpers) return;
  const { player, content } = helpers;

  player.getInventoryItems().subscribe((res: any) => {
    const items = res.items
      .filter((i: any) => !i.isInUse)
      .map((i: any) => ({
        ...content.getItem(i.itemId),
        instanceId: i.instanceId,
      })) as IItem[];

    ctx.patchState({ items });
  });
}

export function removeInventoryItem(
  ctx: StateContext<IInventoryStore>,
  { instanceId }: RemoveInventoryItem,
) {
  ctx.setState(
    patch({ items: removeItem((i: IItem) => i.instanceId === instanceId) }),
  );
}
