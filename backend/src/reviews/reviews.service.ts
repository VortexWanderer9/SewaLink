import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private notifications: NotificationsService,
  ) {}

  async create(authorId: string, dto: { bookingId: string; rating: number; comment?: string }) {
    const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.customerId !== authorId) throw new ForbiddenException('Only the customer can leave a review');
    if (booking.status !== 'COMPLETED') throw new BadRequestException('Can only review completed bookings');
    if (dto.rating < 1 || dto.rating > 5) throw new BadRequestException('Rating must be between 1 and 5');

    const existing = await this.prisma.review.findFirst({ where: { bookingId: dto.bookingId, authorId } });
    if (existing) throw new BadRequestException('Review already submitted for this booking');

    return this.prisma.$transaction(async (tx) => {
      const r = await tx.review.create({
        data: {
          bookingId: dto.bookingId,
          authorId,
          subjectId: booking.workerId,
          rating: dto.rating,
          comment: dto.comment,
          isWorker: false,
        },
      });
      const avg = await tx.review.aggregate({
        where: { subjectId: booking.workerId },
        _avg: { rating: true },
        _count: { _all: true },
      });
      await tx.workerProfile.update({
        where: { userId: booking.workerId },
        data: {
          rating: Math.round((avg._avg.rating || 0) * 10) / 10,
          totalReviews: avg._count._all,
        },
      });
      await this.notifications.sendToUser(
        booking.workerId,
        'REVIEW_RECEIVED',
        'New review received',
        `You received a ${dto.rating}-star review`,
        { reviewId: r.id, bookingId: dto.bookingId },
      );
      return r;
    });
  }

  async findByWorker(workerUserId: string, skip?: number, take?: number, minRating?: number) {
    const where: any = { subjectId: workerUserId, isWorker: false };
    if (minRating) where.rating = { gte: minRating };
    return this.prisma.review.findMany({
      where,
      skip,
      take: take || 20,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, fullName: true, avatarUrl: true } } },
    });
  }

  async findByBooking(bookingId: string) {
    return this.prisma.review.findMany({
      where: { bookingId },
      include: { author: { select: { id: true, fullName: true, avatarUrl: true } } },
    });
  }

  async remove(userId: string, role: Role, id: string) {
    const r = await this.prisma.review.findUnique({ where: { id } });
    if (!r) throw new NotFoundException('Review not found');
    if (role !== Role.ADMIN && r.authorId !== userId) {
      throw new ForbiddenException('Cannot delete others reviews');
    }
    const deleted = await this.prisma.review.delete({ where: { id } });
    await this.audit.log('REVIEW_DELETE', 'REVIEW', id, null, null, undefined, undefined, userId);
    const avg = await this.prisma.review.aggregate({
      where: { subjectId: r.subjectId },
      _avg: { rating: true },
      _count: { _all: true },
    });
    await this.prisma.workerProfile.update({
      where: { userId: r.subjectId },
      data: {
        rating: Math.round((avg._avg.rating || 0) * 10) / 10,
        totalReviews: avg._count._all,
      },
    });
    return deleted;
  }
}
