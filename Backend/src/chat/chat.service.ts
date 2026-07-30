import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
  ) {}

  async sendMessage(senderId: string, dto: SendMessageDto) {
    if (!dto.receiverId && !dto.sectionId) {
      throw new BadRequestException('Must provide receiverId or sectionId');
    }
    const msg = this.messageRepo.create({
      senderId,
      ...dto,
    });
    return this.messageRepo.save(msg);
  }

  async getConversations(userId: string) {
    const query = this.messageRepo
      .createQueryBuilder('msg')
      .leftJoinAndSelect('msg.sender', 'sender')
      .leftJoinAndSelect('msg.receiver', 'receiver')
      .leftJoinAndSelect('msg.section', 'section')
      .where('msg.senderId = :userId OR msg.receiverId = :userId', { userId })
      .orderBy('msg.createdAt', 'DESC');

    const messages = await query.getMany();
    const convos = new Map();

    for (const msg of messages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const key = msg.sectionId
        ? `section_${msg.sectionId}`
        : `user_${partnerId}`;
      if (!convos.has(key)) {
        convos.set(key, msg);
      }
    }
    return Array.from(convos.values());
  }

  async getMessages(
    userId: string,
    partnerId?: string,
    sectionId?: string,
    page: number = 1,
    limit: number = 50,
  ) {
    const query = this.messageRepo
      .createQueryBuilder('msg')
      .leftJoinAndSelect('msg.sender', 'sender')
      .leftJoinAndSelect('msg.receiver', 'receiver')
      .leftJoinAndSelect('msg.section', 'section');

    if (sectionId) {
      query.where('msg.sectionId = :sectionId', { sectionId });
    } else if (partnerId) {
      query.where(
        '(msg.senderId = :userId AND msg.receiverId = :partnerId) OR (msg.senderId = :partnerId AND msg.receiverId = :userId)',
        { userId, partnerId },
      );
    } else {
      throw new BadRequestException('Must provide partnerId or sectionId');
    }

    query
      .orderBy('msg.createdAt', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    return query.getMany();
  }

  async markAsRead(userId: string, messageId: string) {
    const msg = await this.messageRepo.findOne({ where: { id: messageId } });
    if (msg && msg.receiverId === userId) {
      msg.isRead = true;
      return this.messageRepo.save(msg);
    }
    return msg;
  }
}
