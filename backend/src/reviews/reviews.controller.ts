import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles, CurrentUser, CurrentUserType } from '../common/decorators/auth.decorator';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiOperation({ summary: '[Customer] Create review for a completed booking' })
  create(@CurrentUser() user: CurrentUserType, @Body() body: { bookingId: string; rating: number; comment?: string }) {
    return this.reviewsService.create(user.id, body);
  }

  @Get('worker/:workerUserId')
  @ApiOperation({ summary: 'List reviews received by a worker (public)' })
  findByWorker(
    @Param('workerUserId') workerUserId: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('minRating') minRating?: number,
  ) {
    return this.reviewsService.findByWorker(workerUserId, skip, take, minRating);
  }

  @Get('booking/:bookingId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List reviews for a booking' })
  findByBooking(@Param('bookingId') bookingId: string) {
    return this.reviewsService.findByBooking(bookingId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review (admin or author)' })
  remove(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.reviewsService.remove(user.id, user.role, id);
  }
}
