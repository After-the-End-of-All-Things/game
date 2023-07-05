import { INotification } from '@interfaces';

export class SetNotifications {
  static type = '[Notifications] Set';
  constructor(public notifications: INotification[]) {}
}

export class AddNotification {
  static type = '[Notifications] Apply Patches';
  constructor(public notification: INotification) {}
}

export class MarkNotificationRead {
  static type = '[Notifications] Mark Read';
  constructor(public id: string) {}
}

export class MarkAllNotificationsRead {
  static type = '[Notifications] Mark All Read';
  constructor() {}
}

export class ClearNotificationActions {
  static type = '[Notifications] Clear Actions';
  constructor(public id: string) {}
}

export class Notify {
  static type = 'Notify';
  constructor(public messageType: string, public message: string) {}
}
