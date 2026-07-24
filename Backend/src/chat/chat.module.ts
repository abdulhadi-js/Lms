import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Message } from './entities/message.entity';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    // JwtModule.register({})
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService]
})
export class ChatModule {}
