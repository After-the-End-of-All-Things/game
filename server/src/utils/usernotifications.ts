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
  return userNotifyObject(message, 'danger');
}

export function userError(message: string): UserResponse {
  return userNotify(message, 'danger');
}

export function userSuccessObject(message: string) {
  return userNotifyObject(message, 'success');
}

export function userSuccess(message: string): UserResponse {
  return userNotify(message, 'success');
}
