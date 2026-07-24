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
    if (!dto.receiverId && !dto.courseId) {
      throw new BadRequestException('Must provide receiverId or courseId');
    }
    const msg = this.messageRepo.create({
      senderId,
      ...dto
    });
    return this.messageRepo.save(msg);
  }

  async getConversations(userId: string) {
    // Simplified: Return latest messages for users
    const query = this.messageRepo.createQueryBuilder('msg')
      .where('msg.senderId = :userId OR msg.receiverId = :userId', { userId })
      .orderBy('msg.createdAt', 'DESC');
    
    const messages = await query.getMany();
    const convos = new Map();
    
    for (const msg of messages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const key = msg.courseId ? `course_${msg.courseId}` : `user_${partnerId}`;
      if (!convos.has(key)) {
        convos.set(key, msg);
      }
    }
    return Array.from(convos.values());
  }

  async getMessages(userId: string, partnerId?: string, courseId?: string, page: number = 1, limit: number = 50) {
    const query = this.messageRepo.createQueryBuilder('msg');
    
    if (courseId) {
      query.where('msg.courseId = :courseId', { courseId });
    } else if (partnerId) {
      query.where('(msg.senderId = :userId AND msg.receiverId = :partnerId) OR (msg.senderId = :partnerId AND msg.receiverId = :userId)', { userId, partnerId });
    } else {
      throw new BadRequestException('Must provide partnerId or courseId');
    }

    query.orderBy('msg.createdAt', 'DESC')
         .skip((page - 1) * limit)
         .take(limit);

    return query.getManyAndCount();
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
