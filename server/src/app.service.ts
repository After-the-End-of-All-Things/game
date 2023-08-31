import { UserResponse } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { fromEvent } from 'rxjs';

@Injectable()
export class AppService {
  private readonly events = new EventEmitter2();

  public subscribe(channel: string) {
    return fromEvent(this.events, channel);
  }

  public emit(channel: string, data: UserResponse = {}) {
    this.events.emit(channel, { data });
  }

  @OnEvent('userdata.send')
  public sendUserData(event: { userId: string; data: any }) {
    this.emit(event.userId, event.data);
  }
}
