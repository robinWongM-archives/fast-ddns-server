import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import * as WebSocket from 'ws';
import { AppService } from './app.service';
import { Record } from './record.entity';

@WebSocketGateway({
  path: '/subscribe',
})
export class NotifyGateway implements OnGatewayInit, OnGatewayConnection {
  private logger = new Logger(NotifyGateway.name);

  @WebSocketServer() server: WebSocket.Server;

  constructor(private readonly appService: AppService) {}

  afterInit(server: WebSocket.Server) {
    this.logger.log('Gateway inited.');
  }

  async handleConnection(client: WebSocket, request: IncomingMessage) {
    // do nothing
    const { remoteAddress, remotePort } = request.socket;
    this.logger.log(`New connection from ${remoteAddress}:${remotePort} established.`);
    client.on('close', () => this.logger.log(`Connection from ${remoteAddress}:${remotePort} closed.`));
  }

  @SubscribeMessage('list')
  async handleListMessage(client: WebSocket, payload: any) {
    return {
      event: 'list',
      data: await this.appService.getAllRecords(),
    };
  }

  sendUpdate(record: Record) {
    this.server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          event: 'update',
          data: record,
        }));
      }
    });
  }
}
