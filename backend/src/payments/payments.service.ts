import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private notifications: NotificationsService,
  ) {}

  async initiatePayment(userId: string, bookingId: string, method: PaymentMethod, metadata?: any) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, OR: [{ customerId: userId }, { workerId: userId }] },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.paidAt) throw new BadRequestException('Booking already paid');

    const existing = await this.prisma.payment.findFirst({ where: { bookingId, status: 'INITIATED' } });
    if (existing) {
      return this.buildPaymentIntent(existing);
    }

    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        amount: booking.totalAmount,
        method,
        status: PaymentStatus.INITIATED,
        gateway: method === 'CASH' ? null : method,
        metadata: metadata || {},
      },
    });

    return this.buildPaymentIntent(payment);
  }

  private buildPaymentIntent(payment: any) {
    return {
      paymentId: payment.id,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      bookingId: payment.bookingId,
      gatewayConfig: this.buildGatewayConfig(payment),
    };
  }

  private buildGatewayConfig(payment: any) {
    switch (payment.method) {
      case 'ESEWA':
        return {
          gateway: 'ESEWA',
          baseUrl: process.env.ESEWA_BASE_URL || 'https://uat.esewa.com.np',
          merchantId: process.env.ESEWA_MERCHANT_ID || 'EPAYTEST',
          paymentUrl: `${process.env.ESEWA_BASE_URL || 'https://uat.esewa.com.np'}/epay/main`,
          params: {
            amt: payment.amount.toNumber(),
            psc: 0,
            pdc: 0,
            txAmt: 0,
            tAmt: payment.amount.toNumber(),
            pid: payment.id,
            scd: process.env.ESEWA_MERCHANT_ID || 'EPAYTEST',
          },
        };
      case 'KHALTI':
        return {
          gateway: 'KHALTI',
          baseUrl: process.env.KHALTI_BASE_URL || 'https://a.khalti.com/api/v2',
          publicKey: process.env.KHALTI_PUBLIC_KEY || 'test_public_key',
        };
      case 'IMEPAY':
        return {
          gateway: 'IMEPAY',
          baseUrl: process.env.IMEPAY_BASE_URL || 'https://stg.imepay.com.np/api/v1',
          merchantId: process.env.IMEPAY_MERCHANT_ID || 'test_merchant',
        };
      case 'CASH':
        return { gateway: 'CASH', note: 'Collect cash on service completion' };
      default:
        return {};
    }
  }

  async verifyEsewa(userId: string, data: { oid: string; amt: string; refId: string; success?: string }) {
    if (data.success === false) {
      return { success: false, message: 'eSewa payment cancelled or failed' };
    }
    const payment = await this.prisma.payment.findUnique({ where: { id: data.oid }, include: { booking: true } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (parseFloat(data.amt) < parseFloat(payment.amount.toString())) {
      throw new BadRequestException('Amount mismatch');
    }
    return this.completePayment(payment.id, { transactionId: data.refId, paidBy: userId });
  }

  async verifyKhalti(userId: string, data: { token: string; amount: number; bookingId: string }) {
    const booking = await this.prisma.booking.findUnique({ where: { id: data.bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    const payment = await this.prisma.payment.findFirst({ where: { bookingId: booking.id, status: { in: ['PENDING', 'INITIATED'] } } });
    if (!payment) throw new NotFoundException('Payment not found');
    return this.completePayment(payment.id, { transactionId: `khalti-${data.token}`, paidBy: userId });
  }

  async verifyImepay(userId: string, data: { paymentId: string; transactionId: string }) {
    return this.completePayment(data.paymentId, { transactionId: data.transactionId, paidBy: userId });
  }

  private async completePayment(paymentId: string, extra: any) {
    const updated = await this.prisma.$transaction(async (tx) => {
      const p = await tx.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.COMPLETED, transactionId: extra.transactionId, paidAt: new Date(), gateway: extra.gateway },
        include: { booking: true },
      });
      await tx.booking.update({
        where: { id: p.bookingId },
        data: { paidAt: p.paidAt, status: p.booking.status === 'PENDING' ? 'ACCEPTED' : p.booking.status },
      });
      return p;
    });
    await this.notifications.sendToUser(
      updated.booking.workerId,
      'PAYMENT_RECEIVED',
      'Payment received',
      `Rs ${updated.amount.toNumber()} received for booking`,
      { bookingId: updated.bookingId, paymentId: updated.id },
    );
    await this.audit.log('PAYMENT_COMPLETE', 'PAYMENT', updated.id, null, { status: 'COMPLETED' }, undefined, undefined, extra.paidBy);
    return { success: true, paymentId: updated.id, status: PaymentStatus.COMPLETED };
  }

  async markCashPaid(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    let payment = await this.prisma.payment.findFirst({ where: { bookingId, method: 'CASH' } });
    if (!payment) {
      payment = await this.prisma.payment.create({
        data: {
          bookingId,
          amount: booking.totalAmount,
          method: PaymentMethod.CASH,
          status: PaymentStatus.COMPLETED,
          paidAt: new Date(),
          transactionId: `cash-${Date.now()}`,
        },
      });
    } else {
      payment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.COMPLETED, paidAt: new Date() },
      });
    }
    await this.prisma.booking.update({ where: { id: bookingId }, data: { paidAt: new Date() } });
    await this.audit.log('PAYMENT_CASH', 'PAYMENT', payment.id, null, { status: 'COMPLETED' }, undefined, undefined, userId);
    return payment;
  }

  async findByBooking(bookingId: string, userId: string, role: string) {
    const b = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!b) throw new NotFoundException('Booking not found');
    if (role !== 'ADMIN' && b.customerId !== userId && b.workerId !== userId) {
      throw new NotFoundException('Access denied');
    }
    return this.prisma.payment.findMany({ where: { bookingId }, orderBy: { createdAt: 'desc' } });
  }

  async refund(userId: string, paymentId: string, reason: string, partialAmount?: number) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId }, include: { booking: true } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment not in refundable state');
    }
    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: partialAmount ? PaymentStatus.PARTIAL_REFUND : PaymentStatus.REFUNDED,
        refundAmount: partialAmount || payment.amount,
        refundedAt: new Date(),
        failureReason: reason,
      },
    });
  }
}
