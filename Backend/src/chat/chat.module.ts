import { RolesModule } from '../roles/roles.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Message } from './entities/message.entity';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [RolesModule, TypeOrmModule.forFeature([Message]), AuthModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
