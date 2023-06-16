import { INotification } from '@interfaces';
import * as jsonpatch from 'fast-json-patch';

export class SetNotifications {
  static type = '[Notifications] Set';
  constructor(public notifications: INotification[]) {}
}

export class ApplyNotificationsPatches {
  static type = '[Notifications] Apply Patches';
  constructor(public patches: jsonpatch.Operation[]) {}
}

export class MarkNotificationRead {
  static type = '[Notifications] Mark Read';
  constructor(public id: string) {}
}

export class ClearNotificationActions {
  static type = '[Notifications] Clear Actions';
  constructor(public id: string) {}
}
