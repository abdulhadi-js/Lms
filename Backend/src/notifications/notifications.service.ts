import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notificationRepo: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto, senderId: string) {
    const notif = this.notificationRepo.create({
      ...dto,
      senderId,
    });
    return this.notificationRepo.save(notif);
  }

  async findAll(currentUser: any) {
    const query = this.notificationRepo.createQueryBuilder('notif')
      .where('notif.audienceRole = :role OR notif.audienceRole IS NULL', { role: currentUser.role })
      .orderBy('notif.createdAt', 'DESC');
    
    // If student, theoretically join with enrollments to match courseId.
    // For simplicity, returning all global role-matched notifications.
    return query.getMany();
  }

  async findOne(id: string) {
    const notif = await this.notificationRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notification not found');
    return notif;
  }
}
