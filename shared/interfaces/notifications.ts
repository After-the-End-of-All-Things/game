export interface INotificationAction {
  text: string;
  action: string;
  actionData: any;
  url?: string;
  urlData?: any;
  clearActionsForUrl?: string;
}

export interface INotification {
  internalId: string;
  createdAt: Date;
  liveAt: Date;
  text: string;
  read?: boolean;
  actions?: INotificationAction[];
}
