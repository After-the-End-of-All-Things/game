import { UserResponse } from '@interfaces';

export function userNotifyObject(message: string, type: string) {
  return {
    type: 'Notify',
    messageType: type,
    message,
  };
}

export function userNotify(message: string, type: string): UserResponse {
  return {
    actions: [userNotifyObject(message, type)],
  };
}

export function userErrorObject(message: string) {
  return this.userNotifyObject(message, 'error');
}

export function userError(message: string): UserResponse {
  return this.userNotify(message, 'error');
}

export function userSuccessObject(message: string) {
  return this.userNotifyObject(message, 'success');
}

export function userSuccess(message: string): UserResponse {
  return this.userNotify(message, 'success');
}
