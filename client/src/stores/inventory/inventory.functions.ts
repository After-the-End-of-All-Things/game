import { IAttachmentHelpers, IInventoryStore, IItem } from '@interfaces';
import { StateContext } from '@ngxs/store';
import { patch, removeItem } from '@ngxs/store/operators';
import { applyPatch } from 'fast-json-patch';
import {
  ApplyInventoryPatches,
  RemoveInventoryItem,
  RemoveInventoryResource,
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
    otherJobEquipment: {},
    resources: {},
  },
  items: [],
  isLoadingItems: false,
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

  ctx.patchState({ isLoadingItems: true });
  player.getInventoryItems().subscribe((res: any) => {
    const items = res.items
      .filter((i: any) => !i.isInUse)
      .map((i: any) => ({
        ...content.getItem(i.itemId),
        instanceId: i.instanceId,
      })) as IItem[];

    ctx.patchState({ items, isLoadingItems: false });
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

export function removeInventoryResource(
  ctx: StateContext<IInventoryStore>,
  { itemId, quantity }: RemoveInventoryResource,
) {
  ctx.setState(
    patch({
      inventory: patch({
        resources: patch({
          [itemId]: (current: number) => current - quantity,
        }),
      }),
    }),
  );
}
