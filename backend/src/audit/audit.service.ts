import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(
    action: string,
    entityType: string,
    entityId?: string,
    oldValue?: any,
    newValue?: any,
    ipAddress?: string,
    userAgent?: string,
    userId?: string,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          action,
          entityType,
          entityId,
          oldValue,
          newValue,
          ipAddress,
          userAgent,
          userId,
        },
      });
    } catch (e) {
      console.error('Audit log failed:', e);
    }
  }

  async findAll(params: { skip?: number; take?: number; action?: string; entityType?: string; userId?: string }) {
    const where: any = {};
    if (params.action) where.action = params.action;
    if (params.entityType) where.entityType = params.entityType;
    if (params.userId) where.userId = params.userId;
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: params.skip,
        take: params.take || 50,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, fullName: true, role: true } } },
      }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { data, total, skip: params.skip || 0, take: params.take || 50 };
  }
}
