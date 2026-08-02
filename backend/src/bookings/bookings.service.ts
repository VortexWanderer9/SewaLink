import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, Role, PaymentMethod, PaymentStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private audit: AuditService,
  ) {}

  async create(customerId: string, dto: any, ip?: string, ua?: string) {
    const worker = await this.prisma.workerProfile.findFirst({
      where: { userId: dto.workerId, verificationStatus: 'VERIFIED' },
    });
    if (!worker) throw new BadRequestException('Worker not found or not verified');

    const address = dto.addressId
      ? await this.prisma.address.findFirst({ where: { id: dto.addressId, userId: customerId } })
      : null;

    const basePrice = dto.basePrice || worker.priceFrom.toNumber();
    const partsPrice = dto.partsPrice || 0;
    const tipAmount = dto.tipAmount || 0;
    const subtotal = basePrice + partsPrice;
    const platformFee = Math.round(subtotal * 0.15);
    const totalAmount = subtotal + tipAmount + platformFee;
    const workerEarnings = subtotal + tipAmount - platformFee;

    const booking = await this.prisma.booking.create({
      data: {
        customerId,
        workerId: dto.workerId,
        categorySlug: worker.categorySlug,
        addressId: address?.id,
        scheduledAt: new Date(dto.scheduledAt),
        durationMinutes: dto.durationMinutes,
        addressText: address?.fullAddress || dto.addressText,
        description: dto.description,
        notes: dto.notes,
        basePrice,
        partsPrice,
        tipAmount,
        platformFee,
        totalAmount,
        workerEarnings,
      },
      include: { customer: true, worker: true },
    });

    if (dto.paymentMethod && dto.paymentMethod !== 'CASH') {
      await this.prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: totalAmount,
          method: dto.paymentMethod,
          status: PaymentStatus.PENDING,
          gateway: dto.paymentMethod,
        },
      });
    }

    await this.notifications.sendToUser(
      dto.workerId,
      'BOOKING_CREATED',
      'New booking request',
      `${booking.customer.fullName} has requested your service`,
      { bookingId: booking.id },
    );
    await this.audit.log('BOOKING_CREATE', 'BOOKING', booking.id, null, booking, ip, ua, customerId);
    this.logger.log(`Booking created: ${booking.id}`);
    return booking;
  }

  async findOne(id: string, userId: string, role: Role) {
    const b = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, fullName: true, phone: true, avatarUrl: true } },
        worker: { select: { id: true, fullName: true, phone: true, avatarUrl: true } },
        address: true,
        payments: true,
        reviews: true,
      },
    });
    if (!b) throw new NotFoundException('Booking not found');
    if (role !== Role.ADMIN && b.customerId !== userId && b.workerId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return b;
  }

  async findUserBookings(userId: string, role: Role, status?: BookingStatus, skip?: number, take?: number) {
    const where: any = {};
    if (role === Role.WORKER) where.workerId = userId;
    else if (role === Role.CUSTOMER) where.customerId = userId;
    if (status) where.status = status;

    return this.prisma.booking.findMany({
      where,
      skip: skip || 0,
      take: take || 20,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { id: true, fullName: true, avatarUrl: true } },
        worker: { select: { id: true, fullName: true, avatarUrl: true } },
        category: true,
        payments: true,
      },
    });
  }

  async updateStatus(id: string, userId: string, role: Role, status: BookingStatus, extra: any = {}) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    const allowedByWorker = [BookingStatus.ACCEPTED, BookingStatus.REJECTED, BookingStatus.EN_ROUTE, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED];
    const allowedByCustomer = [BookingStatus.CANCELLED];
    const canTransition =
      role === Role.ADMIN ||
      (role === Role.WORKER && booking.workerId === userId && allowedByWorker.includes(status)) ||
      (role === Role.CUSTOMER && booking.customerId === userId && allowedByCustomer.includes(status));

    if (!canTransition) throw new ForbiddenException('Status transition not allowed');

    const data: any = { status };
    const now = new Date();
    if (status === BookingStatus.COMPLETED) {
      data.completedAt = now;
      data.paidAt = extra.paidAt || now;
    } else if (status === BookingStatus.CANCELLED) {
      data.cancelledAt = now;
      data.cancelledBy = role === Role.WORKER ? 'WORKER' : role === Role.CUSTOMER ? 'CUSTOMER' : 'ADMIN';
      data.cancelReason = extra.reason;
    } else if (status === BookingStatus.EN_ROUTE) {
      data.arrivedAt = extra.arrivedAt || null;
    } else if (status === BookingStatus.IN_PROGRESS) {
      data.arrivedAt = booking.arrivedAt || now;
      data.startedAt = now;
    }

    const updated = await this.prisma.booking.update({ where: { id }, data });

    if (status === BookingStatus.COMPLETED) {
      await this.prisma.earning.create({
        data: {
          userId: booking.workerId,
          bookingId: id,
          amount: booking.workerEarnings,
          type: 'BOOKING',
          description: `Booking #${id.slice(-6)}`,
          earnedAt: now,
        },
      });
      await this.prisma.workerProfile.update({
        where: { userId: booking.workerId },
        data: {
          totalJobsDone: { increment: 1 },
          totalEarnings: { increment: booking.workerEarnings.toNumber() },
        },
      });
      await this.prisma.customerProfile.update({
        where: { userId: booking.customerId },
        data: {
          totalBookings: { increment: 1 },
          totalSpent: { increment: booking.totalAmount.toNumber() },
        },
      });
    }

    const notifyUserId = role === Role.WORKER ? booking.customerId : booking.workerId;
    await this.notifications.sendToUser(
      notifyUserId,
      'BOOKING_UPDATED',
      'Booking updated',
      `Your booking status is now ${status}`,
      { bookingId: id, status },
    );
    await this.audit.log(
      'BOOKING_STATUS_CHANGE',
      'BOOKING',
      id,
      { status: booking.status },
      { status, ...extra },
      undefined,
      undefined,
      userId,
    );
    return updated;
  }

  async reschedule(customerId: string, id: string, newTime: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.customerId !== customerId) throw new ForbiddenException('Access denied');
    if ([BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.IN_PROGRESS].includes(booking.status)) {
      throw new BadRequestException('Booking cannot be rescheduled in current state');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        scheduledAt: new Date(newTime),
        notes: reason ? `${booking.notes || ''}\nReschedule note: ${reason}`.trim() : booking.notes,
      },
    });
    await this.notifications.sendToUser(
      booking.workerId,
      'BOOKING_UPDATED',
      'Booking rescheduled',
      'Customer has rescheduled the booking time',
      { bookingId: id },
    );
    return updated;
  }
}
