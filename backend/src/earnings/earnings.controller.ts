import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles, CurrentUser, CurrentUserType } from '../common/decorators/auth.decorator';
import { EarningsService } from './earnings.service';

@ApiTags('Earnings')
@ApiBearerAuth()
@Controller('earnings')
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) {}

  @Get('me')
  @Roles(Role.WORKER)
  @ApiOperation({ summary: '[Worker] My earnings summary + line items' })
  getMyEarnings(
    @CurrentUser() user: CurrentUserType,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.earningsService.getWorkerEarnings(
      user.id,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }

  @Get('me/payouts')
  @Roles(Role.WORKER)
  @ApiOperation({ summary: '[Worker] Payout history' })
  getMyPayouts(
    @CurrentUser() user: CurrentUserType,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.earningsService.getPayouts(user.id, skip, take);
  }

  @Post('me/request')
  @Roles(Role.WORKER)
  @ApiOperation({ summary: '[Worker] Request payout of all pending earnings' })
  requestPayout(@CurrentUser() user: CurrentUserType, @Body() body?: { amount?: number }) {
    return this.earningsService.requestPayout(user.id, body?.amount);
  }

  @Patch('admin/payouts/:payoutId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Process payout' })
  processPayout(
    @CurrentUser() admin: CurrentUserType,
    @Param('payoutId') payoutId: string,
    @Body() body: { status: string; referenceId?: string; notes?: string },
  ) {
    return this.earningsService.processPayout(admin.id, payoutId, body.status, body.referenceId, body.notes);
  }
}
