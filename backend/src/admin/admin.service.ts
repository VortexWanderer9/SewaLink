import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async dashboardOverview() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    const [
      totalUsers,
      totalCustomers,
      totalWorkers,
      verifiedWorkers,
      pendingWorkers,
      totalBookings,
      activeBookings,
      completedBookings,
      todayBookings,
      monthRevenue,
      yearRevenue,
      totalRevenue,
      totalReviews,
      avgRating,
      recentBookings,
      pendingVerifications,
      topWorkers,
      bookingByStatus,
      bookingsByCategory,
      monthlyBookings,
    ] = await Promise.all([
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER', isActive: true } }),
      this.prisma.user.count({ where: { role: 'WORKER', isActive: true } }),
      this.prisma.workerProfile.count({ where: { verificationStatus: 'VERIFIED' } }),
      this.prisma.workerProfile.count({ where: { verificationStatus: { in: ['PENDING', 'IN_REVIEW'] } } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: { in: ['PENDING', 'ACCEPTED', 'EN_ROUTE', 'IN_PROGRESS'] } } }),
      this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
      this.prisma.booking.count({ where: { createdAt: { gte: startOfToday } } }),
      this.prisma.booking.aggregate({ where: { status: 'COMPLETED', completedAt: { gte: startOfMonth } }, _sum: { totalAmount: true } }),
      this.prisma.booking.aggregate({ where: { status: 'COMPLETED', completedAt: { gte: startOfYear } }, _sum: { totalAmount: true } }),
      this.prisma.booking.aggregate({ where: { status: 'COMPLETED' }, _sum: { totalAmount: true } }),
      this.prisma.review.count(),
      this.prisma.workerProfile.aggregate({ _avg: { rating: true } }),
      this.prisma.booking.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: {
        customer: { select: { id: true, fullName: true } },
        worker: { select: { id: true, fullName: true } },
        category: true,
      }}),
      this.prisma.workerProfile.findMany({
        where: { verificationStatus: { in: ['PENDING', 'IN_REVIEW'] } },
        take: 15, orderBy: { createdAt: 'asc' },
        include: { user: { select: { id: true, fullName: true, phone: true, email: true, createdAt: true, documents: true } }, category: true },
      }),
      this.prisma.workerProfile.findMany({
        where: { verificationStatus: 'VERIFIED' },
        take: 5,
        orderBy: [{ totalJobsDone: 'desc' }, { rating: 'desc' }],
        include: { user: { select: { id: true, fullName: true, avatarUrl: true } }, category: true },
      }),
      this.prisma.booking.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.booking.groupBy({ by: ['categorySlug'], _count: { _all: true }, _sum: { totalAmount: true } }),
      this.getMonthlyBookingsChart(12),
    ]);

    return {
      cards: {
        totalUsers,
        totalCustomers,
        totalWorkers,
        verifiedWorkers,
        pendingWorkers,
        totalBookings,
        activeBookings,
        completedBookings,
        todayBookings,
        totalReviews,
        avgRating: avgRating._avg.rating || 0,
        monthRevenue: monthRevenue._sum.totalAmount || 0,
        yearRevenue: yearRevenue._sum.totalAmount || 0,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
      },
      recentBookings,
      pendingVerifications,
      topWorkers,
      charts: {
        bookingByStatus,
        bookingsByCategory,
        monthlyBookings,
      },
    };
  }

  private async getMonthlyBookingsChart(months: number) {
    const result: any[] = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const [monthlyBookings, monthlyRevenue] = await Promise.all([
        this.prisma.booking.count({ where: { createdAt: { gte: start, lte: end } } }),
        this.prisma.booking.aggregate({
          where: { status: 'COMPLETED', completedAt: { gte: start, lte: end } },
          _sum: { totalAmount: true },
        }),
      ]);
      result.push({
        month: start.toLocaleString('default', { month: 'short' }),
        year: start.getFullYear(),
        bookings: monthlyBookings,
        revenue: monthlyRevenue._sum.totalAmount || 0,
      });
    }
    return result;
  }

  async systemHealth() {
    const dbStatus = await this.prisma.$queryRaw`SELECT 1 as status`.then(() => 'ok').catch(() => 'error');
    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      memory: {
        rss: process.memoryUsage().rss,
        heapTotal: process.memoryUsage().heapTotal,
        heapUsed: process.memoryUsage().heapUsed,
      },
      environment: process.env.NODE_ENV || 'development',
    };
  }

  async reports(params: { type: string; from?: Date; to?: Date; format?: string }) {
    const where: any = {};
    if (params.from) where.createdAt = { gte: params.from };
    if (params.to) where.createdAt = { ...(where.createdAt || {}), lte: params.to };

    switch (params.type) {
      case 'bookings':
        return this.prisma.booking.findMany({
          where,
          orderBy: { createdAt: 'asc' },
          include: {
            customer: { select: { id: true, fullName: true, phone: true, email: true } },
            worker: { select: { id: true, fullName: true, phone: true, email: true } },
            category: true,
            payments: true,
          },
        });
      case 'revenue':
        return this.prisma.booking.groupBy({
          by: ['categorySlug'],
          where: { ...where, status: 'COMPLETED' },
          _sum: { totalAmount: true, platformFee: true, workerEarnings: true },
          _count: { _all: true },
          _avg: { totalAmount: true },
        });
      case 'workers':
        return this.prisma.workerProfile.findMany({
          include: {
            user: { select: { id: true, fullName: true, phone: true, email: true, createdAt: true } },
            category: true,
          },
          orderBy: { createdAt: 'asc' },
        });
      default:
        return { error: 'Unknown report type', available: ['bookings', 'revenue', 'workers'] };
    }
  }
}
