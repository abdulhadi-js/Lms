import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  getConversations(@Req() req: any) {
    return this.chatService.getConversations(req.user.id || req.user.userId);
  }

  @Get('messages')
  getMessages(
    @Query('partnerId') partnerId: string,
    @Query('sectionId') sectionId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: any,
  ) {
    return this.chatService.getMessages(
      req.user.id || req.user.userId,
      partnerId,
      sectionId,
      page,
      limit,
    );
  }

  @Post('messages')
  sendMessage(@Body() dto: SendMessageDto, @Req() req: any) {
    return this.chatService.sendMessage(req.user.id || req.user.userId, dto);
  }

  @Patch('messages/:id/read')
  markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.chatService.markAsRead(req.user.id || req.user.userId, id);
  }
}
