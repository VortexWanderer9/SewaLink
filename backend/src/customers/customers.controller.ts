import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles, CurrentUser, CurrentUserType } from '../common/decorators/auth.decorator';
import { CustomersService } from './customers.service';

@ApiTags('Customers')
@ApiBearerAuth()
@Roles(Role.CUSTOMER, Role.ADMIN)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('me/dashboard')
  @ApiOperation({ summary: '[Customer] Customer dashboard summary & recent bookings' })
  getDashboard(@CurrentUser() user: CurrentUserType) {
    return this.customersService.getDashboard(user.id);
  }

  @Get('me/history')
  @ApiOperation({ summary: '[Customer] Booking history (completed bookings)' })
  getHistory(
    @CurrentUser() user: CurrentUserType,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.customersService.getHistory(user.id, skip, take);
  }
}
