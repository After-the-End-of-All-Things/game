export interface INotificationAction {
  text: string;
  action: string;
  actionData: any;
  url?: string;
  urlData?: any;
}

export interface INotification {
  id?: string;
  createdAt: Date;
  liveAt: Date;
  text: string;
  read?: boolean;
  actions?: INotificationAction[];
}
