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
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @RequirePermission(ModuleId.MESSAGING, 'VIEW')
  getConversations(@Req() req: any) {
    return this.chatService.getConversations(req.user.id || req.user.userId);
  }

  @Get('messages')
  @RequirePermission(ModuleId.MESSAGING, 'VIEW')
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
  @RequirePermission(ModuleId.MESSAGING, 'ADD')
  sendMessage(@Body() dto: SendMessageDto, @Req() req: any) {
    return this.chatService.sendMessage(req.user.id || req.user.userId, dto);
  }

  @Patch('messages/:id/read')
  @RequirePermission(ModuleId.MESSAGING, 'EDIT')
  markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.chatService.markAsRead(req.user.id || req.user.userId, id);
  }
}
