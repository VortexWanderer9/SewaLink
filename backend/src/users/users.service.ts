import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, role: true, fullName: true, email: true, phone: true,
        avatarUrl: true, isActive: true, isEmailVerified: true, isPhoneVerified: true,
        createdAt: true, updatedAt: true,
        customerProfile: true,
        workerProfile: {
          include: {
            category: true,
            badges: { include: { badge: true } },
            skills: true,
            availability: { orderBy: { dayOfWeek: 'asc' } },
          },
        },
      },
    });
  }

  async updateMe(userId: string, dto: any) {
    const { password, ...rest } = dto;
    let data: any = rest;
    if (password) data.passwordHash = await bcrypt.hash(password, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, role: true, fullName: true, email: true, phone: true,
        avatarUrl: true, isEmailVerified: true, isPhoneVerified: true,
      },
    });
  }

  async findAll(role?: Role, skip?: number, take?: number, q?: string) {
    const where: any = {};
    if (role) where.role = role;
    if (q) {
      where.OR = [
        { fullName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where, skip, take: take || 50, orderBy: { createdAt: 'desc' },
        select: {
          id: true, role: true, fullName: true, email: true, phone: true,
          avatarUrl: true, isActive: true, isEmailVerified: true, isPhoneVerified: true,
          createdAt: true,
          customerProfile: true,
          workerProfile: { select: { id: true, verificationStatus: true, categorySlug: true, totalJobsDone: true, rating: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { data, total, skip: skip || 0, take: take || 50 };
  }

  async setActive(adminId: string, userId: string, isActive: boolean) {
    const u = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!u) throw new NotFoundException('User not found');
    const updated = await this.prisma.user.update({ where: { id: userId }, data: { isActive } });
    await this.audit.log('USER_STATUS_CHANGE', 'USER', userId, { isActive: u.isActive }, { isActive }, undefined, undefined, adminId);
    return updated;
  }

  async remove(adminId: string, userId: string) {
    const u = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!u) throw new NotFoundException('User not found');
    const deleted = await this.prisma.user.update({ where: { id: userId }, data: { isActive: false } });
    await this.audit.log('USER_DELETE', 'USER', userId, { isActive: true }, { isActive: false }, undefined, undefined, adminId);
    return deleted;
  }
}
