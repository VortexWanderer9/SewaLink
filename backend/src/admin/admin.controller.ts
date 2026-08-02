import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/auth.decorator';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/overview')
  @ApiOperation({ summary: '[Admin] Dashboard overview with KPIs, charts, recent activity' })
  dashboardOverview() {
    return this.adminService.dashboardOverview();
  }

  @Get('system/health')
  @ApiOperation({ summary: '[Admin] System health, DB status, memory usage' })
  systemHealth() {
    return this.adminService.systemHealth();
  }

  @Get('reports')
  @ApiOperation({ summary: '[Admin] Generate reports (bookings, revenue, workers)' })
  reports(
    @Query('type') type: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('format') format?: string,
  ) {
    return this.adminService.reports({
      type,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      format,
    });
  }
}
