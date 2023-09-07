import { UserResponse } from '@interfaces';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from 'nestjs-pino';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private connectedClients: Record<string, any> = {};
  private clientIdToDbId: Record<string, string> = {};

  @WebSocketServer()
  server: Server;

  constructor(private logger: Logger, private jwtService: JwtService) {}

  afterInit() {
    this.logger.log('Websockets initialized!');
  }

  handleConnection(client: any) {
    const id = client.id;
    const token = client.handshake.query.token;
    if (!token) return;

    const data: any = this.jwtService.decode(token);
    if (!data) return;

    this.logger.log(`Client connected: socket:${id} / dbid:${data.sub}`);
    this.connectedClients[data.sub] = id;
    this.clientIdToDbId[id] = data.sub;
  }

  handleDisconnect(client: any) {
    this.logger.log(
      `Client disconnected: socket:${client.id} / dbid:${
        this.connectedClients[client.id]
      }`,
    );

    const dbId = this.clientIdToDbId[client.id];
    delete this.connectedClients[dbId];
    delete this.clientIdToDbId[client.id];
  }

  @OnEvent('userdata.send')
  public sendUserData(event: { userId: string; data: UserResponse }) {
    this.server
      .to(this.connectedClients[event.userId])
      .emit('userdata', event.data);
  }
}
