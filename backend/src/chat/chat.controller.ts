import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser, CurrentUserType } from '../common/decorators/auth.decorator';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('sessions')
  @ApiOperation({ summary: 'List my chat sessions with previews' })
  getSessions(@CurrentUser() user: CurrentUserType) {
    return this.chatService.getSessions(user.id);
  }

  @Post('session')
  @ApiOperation({ summary: 'Get or create chat session with another user (optionally tied to booking)' })
  getOrCreateSession(
    @CurrentUser() user: CurrentUserType,
    @Body() body: { otherUserId: string; bookingId?: string },
  ) {
    return this.chatService.getOrCreateSession(user.id, body.otherUserId, body.bookingId);
  }

  @Get('sessions/:sessionId/messages')
  @ApiOperation({ summary: 'List messages in a chat session (marks as read for me)' })
  getMessages(
    @CurrentUser() user: CurrentUserType,
    @Param('sessionId') sessionId: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.chatService.getMessages(user.id, sessionId, skip, take);
  }

  @Post('sessions/:sessionId/messages')
  @ApiOperation({ summary: 'Send a message (realtime via chat gateway)' })
  sendMessage(
    @CurrentUser() user: CurrentUserType,
    @Param('sessionId') sessionId: string,
    @Body() body: { content: string; type?: string; mediaUrl?: string },
  ) {
    return this.chatService.sendMessage(user.id, sessionId, body.content, body.type, body.mediaUrl);
  }
}
