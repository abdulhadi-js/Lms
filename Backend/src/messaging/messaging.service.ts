import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageTemplate } from './entities/message-template.entity';
import { MessageOutbox } from './entities/message-outbox.entity';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(MessageTemplate)
    private templateRepo: Repository<MessageTemplate>,
    @InjectRepository(MessageOutbox)
    private outboxRepo: Repository<MessageOutbox>,
  ) {}

  async getTemplates() {
    return this.templateRepo.find();
  }

  async createTemplate(dto: Partial<MessageTemplate>) {
    const template = this.templateRepo.create(dto);
    return this.templateRepo.save(template);
  }

  async getOutbox() {
    return this.outboxRepo.find();
  }

  async queueMessage(dto: Partial<MessageOutbox>) {
    const message = this.outboxRepo.create(dto);
    return this.outboxRepo.save(message);
  }
}
