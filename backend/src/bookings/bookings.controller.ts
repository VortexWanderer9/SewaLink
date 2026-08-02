import { Controller, Get, Post, Body, Param, Put, Patch, Query, Ip, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BookingStatus, Role } from '@prisma/client';
import { Roles, CurrentUser, CurrentUserType } from '../common/decorators/auth.decorator';
import { BookingsService } from './bookings.service';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiOperation({ summary: '[Customer/Admin] Create new booking' })
  create(
    @CurrentUser() user: CurrentUserType,
    @Body() dto: any,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ) {
    return this.bookingsService.create(user.id, dto, ip, ua);
  }

  @Get('me')
  @Roles(Role.CUSTOMER, Role.WORKER, Role.ADMIN)
  @ApiOperation({ summary: 'List my bookings (customer or worker)' })
  getMyBookings(
    @CurrentUser() user: CurrentUserType,
    @Query('status') status?: BookingStatus,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.bookingsService.findUserBookings(user.id, user.role, status, skip, take);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details' })
  findOne(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.bookingsService.findOne(id, user.id, user.role);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status (worker: accept/reject/complete; customer: cancel)' })
  updateStatus(
    @CurrentUser() user: CurrentUserType,
    @Param('id') id: string,
    @Body() body: { status: BookingStatus; reason?: string; paidAt?: string; arrivedAt?: string },
  ) {
    return this.bookingsService.updateStatus(id, user.id, user.role, body.status, body);
  }

  @Put(':id/reschedule')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiOperation({ summary: '[Customer] Reschedule booking time' })
  reschedule(
    @CurrentUser() user: CurrentUserType,
    @Param('id') id: string,
    @Body() body: { scheduledAt: string; reason?: string },
  ) {
    return this.bookingsService.reschedule(user.id, id, body.scheduledAt, body.reason);
  }
}
