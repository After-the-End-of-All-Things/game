import { UserResponse } from '@interfaces';

export function userNotify(message: string, type: string): UserResponse {
  return {
    actions: [
      {
        type: 'Notify',
        messageType: type,
        message,
      },
    ],
  };
}

export function userError(message: string): UserResponse {
  return this.userNotify(message, 'error');
}

export function userSuccess(message: string): UserResponse {
  return this.userNotify(message, 'success');
}
