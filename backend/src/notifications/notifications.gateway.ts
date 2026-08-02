import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/notifications' })
export class NotificationsGateway {
  private readonly logger = new Logger(NotificationsGateway.name);
  @WebSocketServer() server: Server;
  private userSockets = new Map<string, Set<string>>();

  afterInit() {
    this.logger.log('Notifications WebSocket gateway initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId || client.handshake.headers?.['x-user-id'];
    if (userId) {
      if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
      this.userSockets.get(userId)!.add(client.id);
      this.logger.log(`User ${userId} connected to notifications`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth?.userId || client.handshake.headers?.['x-user-id'];
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id);
    }
  }

  emitToUser(userId: string, event: string, payload: any) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      for (const sid of sockets) {
        this.server.to(sid).emit(event, payload);
      }
    }
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.emit('pong', { timestamp: Date.now(), ...data });
  }
}
