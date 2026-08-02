import { Controller, Get, Param, Query, Put, Body, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { VerificationStatus, Role } from '@prisma/client';
import { Public, Roles, CurrentUser, CurrentUserType } from '../common/decorators/auth.decorator';
import { WorkersService } from './workers.service';

@ApiTags('Workers')
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search & filter verified workers' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'verifiedOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'onlineOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'sort', required: false, enum: ['rating', 'price_asc', 'price_desc', 'jobs_desc'] })
  search(
    @Query('category') category?: string,
    @Query('query') query?: string,
    @Query('location') location?: string,
    @Query('minRating') minRating?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('verifiedOnly') verifiedOnly?: boolean,
    @Query('onlineOnly') onlineOnly?: boolean,
    @Query('sort') sort?: 'rating' | 'price_asc' | 'price_desc' | 'jobs_desc',
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.workersService.search({
      category, query, location, minRating, maxPrice, verifiedOnly, onlineOnly, sort, skip, take,
    });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get worker profile by profile ID (public profile)' })
  findById(@Param('id') id: string) {
    return this.workersService.findById(id);
  }

  @Get('me/profile')
  @ApiBearerAuth()
  @Roles(Role.WORKER)
  @ApiOperation({ summary: '[Worker] Get my full worker profile' })
  getMyProfile(@CurrentUser() user: CurrentUserType) {
    return this.workersService.findByUserId(user.id);
  }

  @Put('me/profile')
  @ApiBearerAuth()
  @Roles(Role.WORKER)
  @ApiOperation({ summary: '[Worker] Update my profile, availability, skills' })
  updateMyProfile(@CurrentUser() user: CurrentUserType, @Body() dto: any) {
    return this.workersService.updateMyProfile(user.id, dto);
  }

  @Patch('me/online')
  @ApiBearerAuth()
  @Roles(Role.WORKER)
  @ApiOperation({ summary: '[Worker] Toggle online/offline status' })
  setOnline(@CurrentUser() user: CurrentUserType, @Body() body: { isOnline: boolean }) {
    return this.workersService.setOnline(user.id, body.isOnline);
  }

  @Get('me/bookings')
  @ApiBearerAuth()
  @Roles(Role.WORKER)
  @ApiOperation({ summary: '[Worker] List my bookings' })
  getMyBookings(
    @CurrentUser() user: CurrentUserType,
    @Query('status') status?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.workersService.getBookings(user.id, status, skip, take);
  }

  @Get('me/earnings')
  @ApiBearerAuth()
  @Roles(Role.WORKER)
  @ApiOperation({ summary: '[Worker] Earnings dashboard summary' })
  getMyEarnings(@CurrentUser() user: CurrentUserType) {
    return this.workersService.getEarningsSummary(user.id);
  }

  @Patch(':id/verification')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Update worker verification status' })
  updateVerification(
    @CurrentUser() admin: CurrentUserType,
    @Param('id') id: string,
    @Body() body: { status: VerificationStatus; notes?: string },
  ) {
    return this.workersService.updateVerification(admin.id, id, body.status, body.notes);
  }
}
