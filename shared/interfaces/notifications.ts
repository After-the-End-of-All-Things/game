export interface INotificationAction {
  text: string;
  action: string;
  actionData: any;
}

export interface INotification {
  createdAt: Date;
  liveAt: Date;
  text: string;
  actions?: INotificationAction[];
}
