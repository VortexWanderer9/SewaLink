import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer() server: Server;
  private userSockets = new Map<string, Set<string>>();
  private sessionSockets = new Map<string, Set<string>>();

  constructor(private prisma: PrismaService) {}

  afterInit() {
    this.logger.log('Chat WebSocket gateway initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId || client.handshake.headers?.['x-user-id'];
    const sessionId = client.handshake.auth?.sessionId;
    if (userId) {
      if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
      this.userSockets.get(userId)!.add(client.id);
    }
    if (sessionId) {
      client.join(`session:${sessionId}`);
    }
    this.logger.log(`Chat socket connected: user=${userId}, session=${sessionId}`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth?.userId || client.handshake.headers?.['x-user-id'];
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id);
    }
  }

  emitToChatSession(sessionId: string, event: string, payload: any) {
    this.server.to(`session:${sessionId}`).emit(event, payload);
  }

  emitToUser(userId: string, event: string, payload: any) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      for (const sid of sockets) this.server.to(sid).emit(event, payload);
    }
  }

  @SubscribeMessage('session:join')
  joinSession(@MessageBody() data: { sessionId: string }, @ConnectedSocket() client: Socket) {
    client.join(`session:${data.sessionId}`);
    return { ok: true, sessionId: data.sessionId };
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { sessionId: string; isTyping: boolean }, @ConnectedSocket() client: Socket) {
    const userId = client.handshake.auth?.userId || client.handshake.headers?.['x-user-id'];
    this.server.to(`session:${data.sessionId}`).emit('typing:update', { userId, isTyping: data.isTyping });
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    return { timestamp: Date.now(), ...data };
  }
}
