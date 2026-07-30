import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';
import { MessageTemplate } from './entities/message-template.entity';
import { MessageOutbox } from './entities/message-outbox.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([MessageTemplate, MessageOutbox]), RolesModule],
  controllers: [MessagingController],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
