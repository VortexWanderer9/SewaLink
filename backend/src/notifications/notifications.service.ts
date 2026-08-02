import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private gateway: NotificationsGateway,
  ) {}

  async sendToUser(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: any,
  ) {
    const notif = await this.prisma.notification.create({
      data: { userId, type, title, body, data },
    });
    try {
      this.gateway.emitToUser(userId, 'notification:new', notif);
    } catch (e) {
      this.logger.warn(`Failed to send realtime notification to ${userId}`);
    }
    return notif;
  }

  async findAll(userId: string, isRead?: boolean, skip?: number, take?: number) {
    const where: any = { userId };
    if (isRead !== undefined) where.isRead = isRead;
    return this.prisma.notification.findMany({
      where,
      skip,
      take: take || 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }

  async markRead(userId: string, id: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }
}
