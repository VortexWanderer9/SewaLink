import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationStatus, Role } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class WorkersService {
  private readonly logger = new Logger(WorkersService.name);

  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async search(params: {
    category?: string;
    query?: string;
    location?: string;
    minRating?: number;
    maxPrice?: number;
    verifiedOnly?: boolean;
    onlineOnly?: boolean;
    sort?: 'rating' | 'price_asc' | 'price_desc' | 'jobs_desc';
    skip?: number;
    take?: number;
  }) {
    const where: any = {};
    if (params.category && params.category !== 'all') where.categorySlug = params.category;
    if (params.verifiedOnly) where.verificationStatus = VerificationStatus.VERIFIED;
    if (params.onlineOnly) where.isOnline = true;
    if (params.minRating) where.rating = { gte: params.minRating };
    if (params.maxPrice) where.priceFrom = { lte: params.maxPrice };
    if (params.location) where.location = { contains: params.location, mode: 'insensitive' };

    if (params.query) {
      where.user = {
        OR: [
          { fullName: { contains: params.query, mode: 'insensitive' } },
        ],
      };
      where.OR = [
        { location: { contains: params.query, mode: 'insensitive' } },
        { categorySlug: { contains: params.query, mode: 'insensitive' } },
        { bio: { contains: params.query, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { rating: 'desc' };
    switch (params.sort) {
      case 'price_asc': orderBy = { priceFrom: 'asc' }; break;
      case 'price_desc': orderBy = { priceFrom: 'desc' }; break;
      case 'jobs_desc': orderBy = { totalJobsDone: 'desc' }; break;
      default: orderBy = { rating: 'desc', totalJobsDone: 'desc' };
    }

    const [data, total] = await Promise.all([
      this.prisma.workerProfile.findMany({
        where,
        skip: params.skip || 0,
        take: params.take || 20,
        orderBy,
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true, isPhoneVerified: true } },
          category: true,
          badges: { include: { badge: true } },
          availability: { orderBy: { dayOfWeek: 'asc' } },
          _count: { select: { skills: true } },
        },
      }),
      this.prisma.workerProfile.count({ where }),
    ]);

    return { data, total, skip: params.skip || 0, take: params.take || 20 };
  }

  async findById(id: string) {
    const worker = await this.prisma.workerProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true, isPhoneVerified: true, isEmailVerified: true } },
        category: true,
        badges: { include: { badge: true } },
        skills: true,
        availability: { orderBy: { dayOfWeek: 'asc' } },
      },
    });
    if (!worker) throw new NotFoundException('Worker profile not found');
    return worker;
  }

  async findByUserId(userId: string) {
    const wp = await this.prisma.workerProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, fullName: true, phone: true, email: true, avatarUrl: true } },
        category: true,
        badges: { include: { badge: true } },
        skills: true,
        availability: { orderBy: { dayOfWeek: 'asc' } },
      },
    });
    if (!wp) throw new NotFoundException('Worker profile not found');
    return wp;
  }

  async updateMyProfile(userId: string, dto: any) {
    const wp = await this.prisma.workerProfile.findFirst({ where: { userId } });
    if (!wp) throw new NotFoundException('Worker profile not found');
    const { availability, skills, fullName, ...rest } = dto;
    return this.prisma.$transaction(async (tx) => {
      if (typeof fullName === 'string' && fullName.trim()) {
        await tx.user.update({ where: { id: userId }, data: { fullName: fullName.trim() } });
      }
      const updated = await tx.workerProfile.update({ where: { id: wp.id }, data: rest });
      if (availability) {
        await tx.availability.deleteMany({ where: { workerProfileId: wp.id } });
        await tx.availability.createMany({
          data: availability.map((a: any) => ({ ...a, workerProfileId: wp.id })),
        });
      }
      if (skills) {
        await tx.workerSkill.deleteMany({ where: { workerProfileId: wp.id } });
        await tx.workerSkill.createMany({
          data: skills.map((s: any) => ({
            workerProfileId: wp.id,
            skillName: typeof s === 'string' ? s : s.skillName,
            proficiency: typeof s === 'string' ? undefined : s.proficiency,
          })),
        });
      }
      return updated;
    });
  }

  async setOnline(userId: string, isOnline: boolean) {
    const wp = await this.prisma.workerProfile.findFirst({ where: { userId } });
    if (!wp) throw new NotFoundException('Worker profile not found');
    return this.prisma.workerProfile.update({
      where: { id: wp.id },
      data: { isOnline, lastOnlineAt: isOnline ? undefined : new Date() },
    });
  }

  async updateVerification(adminId: string, workerId: string, status: VerificationStatus, notes?: string) {
    const wp = await this.prisma.workerProfile.findUnique({ where: { id: workerId } });
    if (!wp) throw new NotFoundException('Worker profile not found');
    const updated = await this.prisma.workerProfile.update({
      where: { id: workerId },
      data: {
        verificationStatus: status,
        verificationNotes: notes,
        verifiedAt: status === VerificationStatus.VERIFIED ? new Date() : null,
      },
    });
    await this.audit.log(
      'VERIFICATION_UPDATE',
      'WORKER_PROFILE',
      workerId,
      { verificationStatus: wp.verificationStatus },
      { verificationStatus: status },
      undefined,
      undefined,
      adminId,
    );
    return updated;
  }

  async getBookings(workerUserId: string, status?: string, skip?: number, take?: number) {
    const where: any = { workerId: workerUserId };
    if (status) where.status = status;
    return this.prisma.booking.findMany({
      where,
      skip,
      take: take || 20,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { id: true, fullName: true, phone: true, avatarUrl: true } },
        payments: true,
        reviews: true,
      },
    });
  }

  async getEarningsSummary(workerUserId: string) {
    const wp = await this.prisma.workerProfile.findFirst({ where: { userId: workerUserId } });
    if (!wp) throw new NotFoundException('Worker profile not found');
    const earnings = await this.prisma.earning.groupBy({
      by: ['payoutStatus'],
      where: { userId: workerUserId },
      _sum: { amount: true },
      _count: { _all: true },
    });
    const recentBookings = await this.prisma.booking.count({ where: { workerId: workerUserId } });
    const completed = await this.prisma.booking.count({ where: { workerId: workerUserId, status: 'COMPLETED' } });
    return {
      totalEarnings: wp.totalEarnings,
      totalJobsDone: wp.totalJobsDone,
      avgRating: wp.rating,
      totalReviews: wp.totalReviews,
      recentBookings,
      completed,
      byStatus: earnings,
    };
  }
}
