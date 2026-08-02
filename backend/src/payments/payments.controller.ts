import { Controller, Get, Post, Body, Param, Patch, Req, Res, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PaymentMethod, Role } from '@prisma/client';
import { Roles, CurrentUser, CurrentUserType, Public } from '../common/decorators/auth.decorator';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate payment (eSewa/Khalti/IME Pay/CASH)' })
  initiate(
    @CurrentUser() user: CurrentUserType,
    @Body() body: { bookingId: string; method: PaymentMethod; metadata?: any },
  ) {
    return this.paymentsService.initiatePayment(user.id, body.bookingId, body.method, body.metadata);
  }

  @Public()
  @Post('esewa/callback')
  @ApiOperation({ summary: 'eSewa server callback (webhook)' })
  async esewaCallback(@Body() body: any) {
    return this.paymentsService.verifyEsewa(body.oid, {
      oid: body.oid,
      amt: body.amt,
      refId: body.refId,
      success: body.success,
    });
  }

  @Post('esewa/verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Client-side eSewa payment verify after redirect' })
  verifyEsewa(@CurrentUser() user: CurrentUserType, @Body() body: { oid: string; amt: string; refId: string }) {
    return this.paymentsService.verifyEsewa(user.id, body);
  }

  @Post('khalti/verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Khalti payment via ebanking/mobile banking token' })
  verifyKhalti(@CurrentUser() user: CurrentUserType, @Body() body: { token: string; amount: number; bookingId: string }) {
    return this.paymentsService.verifyKhalti(user.id, body);
  }

  @Post('imepay/verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify IME Pay payment' })
  verifyImepay(@CurrentUser() user: CurrentUserType, @Body() body: { paymentId: string; transactionId: string }) {
    return this.paymentsService.verifyImepay(user.id, body);
  }

  @Post(':bookingId/cash-paid')
  @ApiBearerAuth()
  @Roles(Role.WORKER, Role.ADMIN)
  @ApiOperation({ summary: '[Worker/Admin] Mark cash payment as paid' })
  markCashPaid(@CurrentUser() user: CurrentUserType, @Param('bookingId') bookingId: string) {
    return this.paymentsService.markCashPaid(user.id, bookingId);
  }

  @Get('booking/:bookingId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List payments for a booking' })
  findByBooking(@CurrentUser() user: CurrentUserType, @Param('bookingId') bookingId: string) {
    return this.paymentsService.findByBooking(bookingId, user.id, user.role);
  }

  @Patch(':paymentId/refund')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Refund a payment' })
  refund(
    @CurrentUser() user: CurrentUserType,
    @Param('paymentId') paymentId: string,
    @Body() body: { reason: string; partialAmount?: number },
  ) {
    return this.paymentsService.refund(user.id, paymentId, body.reason, body.partialAmount);
  }
}
