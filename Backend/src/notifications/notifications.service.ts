import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(dto: CreateNotificationDto, senderId: string) {
    const notif = this.notificationRepo.create({
      ...dto,
      senderId,
    });
    const saved = await this.notificationRepo.save(notif);
    this.notificationsGateway.emitNewNotification(saved);
    return saved;
  }

  async findAll(currentUser: any) {
    return this.notificationRepo
      .createQueryBuilder('notif')
      .where('notif.audienceRole = :role OR notif.audienceRole IS NULL', {
        role: currentUser.role,
      })
      .orderBy('notif.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string) {
    const notif = await this.notificationRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notification not found');
    return notif;
  }

  async markAllRead(currentUser: any): Promise<{ updated: number }> {
    const result = await this.notificationRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where(
        '(audienceRole = :role OR audienceRole IS NULL) AND isRead = false',
        {
          role: currentUser.role,
        },
      )
      .execute();

    return { updated: result.affected ?? 0 };
  }
}
