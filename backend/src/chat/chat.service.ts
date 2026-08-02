import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from './chat.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private gateway: ChatGateway,
    private notifications: NotificationsService,
    private audit: AuditService,
  ) {}

  async getOrCreateSession(userId: string, otherUserId: string, bookingId?: string) {
    let session = bookingId
      ? await this.prisma.chatSession.findFirst({ where: { bookingId }, include: { participants: true } })
      : null;

    if (!session) {
      session = await this.prisma.chatSession.findFirst({
        where: {
          AND: [
            { participants: { some: { userId } } },
            { participants: { some: { userId: otherUserId } } },
            { bookingId: null },
          ],
        },
        include: { participants: true },
      });
    }

    if (session) {
      const me = session.participants.find(p => p.userId === userId);
      if (me?.isBlocked) throw new ForbiddenException('Chat session blocked');
      return session;
    }

    return this.prisma.$transaction(async tx => {
      const s = await tx.chatSession.create({
        data: {
          bookingId,
          participants: {
            create: [
              { userId },
              { userId: otherUserId },
            ],
          },
        },
        include: { participants: true },
      });
      return s;
    });
  }

  async getSessions(userId: string) {
    return this.prisma.chatSession.findMany({
      where: { participants: { some: { userId } } },
      orderBy: { lastMessageAt: 'desc' },
      include: {
        participants: {
          include: { user: { select: { id: true, fullName: true, avatarUrl: true, role: true } } },
        },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        booking: { select: { id: true, status: true, scheduledAt: true } },
      },
    });
  }

  async getMessages(userId: string, sessionId: string, skip?: number, take?: number) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { participants: true },
    });
    if (!session) throw new NotFoundException('Chat session not found');
    if (!session.participants.some(p => p.userId === userId)) {
      throw new ForbiddenException('Access denied to this chat');
    }

    await this.prisma.chatParticipant.updateMany({
      where: { chatSessionId: sessionId, userId },
      data: { lastReadAt: new Date() },
    });

    return this.prisma.chatMessage.findMany({
      where: { chatSessionId: sessionId },
      skip: skip || 0,
      take: take || 100,
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, fullName: true, avatarUrl: true } } },
    });
  }

  async sendMessage(senderId: string, sessionId: string, content: string, type: string = 'text', mediaUrl?: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { participants: true },
    });
    if (!session) throw new NotFoundException('Chat session not found');
    const participant = session.participants.find(p => p.userId === senderId);
    if (!participant) throw new ForbiddenException('Not part of this chat');
    if (participant.isBlocked) throw new ForbiddenException('Blocked in this chat');

    const receiver = session.participants.find(p => p.userId !== senderId);

    const msg = await this.prisma.$transaction(async tx => {
      const m = await tx.chatMessage.create({
        data: {
          chatSessionId: sessionId,
          senderId,
          receiverId: receiver!.userId,
          content,
          type,
          mediaUrl,
        },
        include: { sender: { select: { id: true, fullName: true, avatarUrl: true } } },
      });
      await tx.chatSession.update({
        where: { id: sessionId },
        data: { lastMessageAt: new Date() },
      });
      return m;
    });

    try {
      this.gateway.emitToChatSession(sessionId, 'message:new', msg);
    } catch (e) {
      this.logger.warn('Realtime emit failed');
    }

    await this.notifications.sendToUser(
      receiver!.userId,
      'MESSAGE_NEW',
      `New message from ${msg.sender.fullName}`,
      content.length > 60 ? content.slice(0, 60) + '...' : content,
      { chatSessionId: sessionId, messageId: msg.id },
    );

    return msg;
  }
}
