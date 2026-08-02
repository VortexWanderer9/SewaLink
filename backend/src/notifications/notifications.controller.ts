import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser, CurrentUserType } from '../common/decorators/auth.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List my notifications' })
  findAll(
    @CurrentUser() user: CurrentUserType,
    @Query('isRead') isRead?: boolean,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.notificationsService.findAll(user.id, isRead, skip, take);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Unread notification count' })
  getUnreadCount(@CurrentUser() user: CurrentUserType) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark single notification as read' })
  markRead(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.notificationsService.markRead(user.id, id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@CurrentUser() user: CurrentUserType) {
    return this.notificationsService.markAllRead(user.id);
  }
}
