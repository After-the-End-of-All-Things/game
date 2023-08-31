import { INotification } from '@interfaces';

export class SetNotifications {
  static type = '[Notifications] Set';
  constructor(public notifications: INotification[]) {}
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

export class ClearNotificationActionsMatchingUrl {
  static type = '[Notifications] Clear Actions Matching Url';
  constructor(public url: string) {}
}

export class AddNotification {
  static type = 'AddNotification';
  constructor(public notification: INotification) {}
}

export class Notify {
  static type = 'Notify';
  constructor(public messageType: string, public message: string) {}
}
