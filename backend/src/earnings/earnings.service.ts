import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class EarningsService {
  constructor(private prisma: PrismaService) {}

  async getWorkerEarnings(workerUserId: string, from?: Date, to?: Date) {
    const where: any = { userId: workerUserId };
    if (from) where.earnedAt = { ...(where.earnedAt || {}), gte: from };
    if (to) where.earnedAt = { ...(where.earnedAt || {}), lte: to };

    const items = await this.prisma.earning.findMany({
      where,
      orderBy: { earnedAt: 'desc' },
      take: 100,
      include: { payout: { select: { id: true, status: true, processedAt: true } } },
    });

    const totals = await this.prisma.earning.groupBy({
      by: ['payoutStatus'],
      where,
      _sum: { amount: true },
      _count: { _all: true },
    });

    const wp = await this.prisma.workerProfile.findFirst({ where: { userId: workerUserId } });

    return {
      summary: {
        lifetimeTotal: wp?.totalEarnings || 0,
        pending: totals.find(t => t.payoutStatus === 'PENDING')?._sum.amount || 0,
        paid: totals.find(t => t.payoutStatus === 'PAID')?._sum.amount || 0,
      },
      items,
      byStatus: totals,
    };
  }

  async getPayouts(userId: string, skip?: number, take?: number) {
    return this.prisma.payout.findMany({
      where: { userId },
      skip,
      take: take || 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async requestPayout(workerUserId: string, amount?: number) {
    const pending = await this.prisma.earning.findMany({
      where: { userId: workerUserId, payoutStatus: 'PENDING' },
    });
    if (pending.length === 0) {
      throw new ForbiddenException('No pending earnings available for payout');
    }
    const total = pending.reduce((s, e) => s + parseFloat(e.amount.toString()), 0);
    if (total < 500) {
      throw new ForbiddenException('Minimum payout is Rs 500');
    }

    const wp = await this.prisma.workerProfile.findFirst({ where: { userId: workerUserId } });
    if (!wp?.bankAccountNumber) {
      throw new ForbiddenException('Bank account not set in worker profile');
    }

    const earningIds = pending.map(e => e.id);
    return this.prisma.$transaction(async tx => {
      const payout = await tx.payout.create({
        data: {
          userId: workerUserId,
          amount: total,
          method: 'BANK_TRANSFER',
          status: 'PENDING',
          bankName: wp.bankName || undefined,
          accountNumber: wp.bankAccountNumber || undefined,
          accountName: wp.bankAccountName || undefined,
        },
      });
      await tx.earning.updateMany({
        where: { id: { in: earningIds } },
        data: { payoutId: payout.id, payoutStatus: 'IN_PROGRESS' },
      });
      return payout;
    });
  }

  async processPayout(adminId: string, payoutId: string, status: string, referenceId?: string, notes?: string) {
    const payout = await this.prisma.payout.findUnique({ where: { id: payoutId } });
    if (!payout) throw new NotFoundException('Payout not found');

    return this.prisma.$transaction(async tx => {
      const p = await tx.payout.update({
        where: { id: payoutId },
        data: { status, referenceId, processedAt: status === 'PROCESSED' ? new Date() : undefined, notes },
      });
      if (status === 'PROCESSED' || status === 'FAILED') {
        await tx.earning.updateMany({
          where: { payoutId },
          data: { payoutStatus: status === 'PROCESSED' ? 'PAID' : 'PENDING' },
        });
      }
      return p;
    });
  }
}
