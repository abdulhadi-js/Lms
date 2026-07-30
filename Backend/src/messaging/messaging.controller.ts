import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';

@Controller('messaging')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('templates')
  @RequirePermission(ModuleId.MESSAGING, 'VIEW')
  getTemplates() {
    return this.messagingService.getTemplates();
  }

  @Post('templates')
  @RequirePermission(ModuleId.MESSAGING, 'ADD')
  createTemplate(@Body() dto: any) {
    return this.messagingService.createTemplate(dto);
  }

  @Get('outbox')
  @RequirePermission(ModuleId.MESSAGING, 'VIEW')
  getOutbox() {
    return this.messagingService.getOutbox();
  }

  @Post('send')
  @RequirePermission(ModuleId.MESSAGING, 'ADD')
  sendMessage(@Body() dto: any) {
    return this.messagingService.queueMessage(dto);
  }
}
