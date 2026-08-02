import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const cp = await this.prisma.customerProfile.findFirst({ where: { userId } });
    if (!cp) throw new NotFoundException('Customer profile not found');

    const bookingsPromise = this.prisma.booking.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        worker: { select: { id: true, fullName: true, avatarUrl: true } },
        category: true,
        payments: true,
      },
    });

    const countsPromise = this.prisma.booking.groupBy({
      by: ['status'],
      where: { customerId: userId },
      _count: { _all: true },
    });

    const totalSpentPromise = this.prisma.booking.aggregate({
      where: { customerId: userId, status: 'COMPLETED' },
      _sum: { totalAmount: true },
    });

    const [bookings, counts, totalSpent] = await Promise.all([bookingsPromise, countsPromise, totalSpentPromise]);

    return {
      profile: cp,
      bookings,
      summary: {
        totalBookings: cp.totalBookings,
        totalSpent: cp.totalSpent,
        completedSpent: totalSpent._sum.totalAmount || 0,
        byStatus: counts,
      },
    };
  }

  async getHistory(userId: string, skip?: number, take?: number) {
    return this.prisma.booking.findMany({
      where: { customerId: userId, status: 'COMPLETED' },
      skip: skip || 0,
      take: take || 20,
      orderBy: { completedAt: 'desc' },
      include: {
        worker: { select: { id: true, fullName: true, avatarUrl: true } },
        category: true,
        reviews: true,
      },
    });
  }
}
