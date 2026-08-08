import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Campus } from '../../campuses/entities/campus.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ nullable: true })
  audienceRole: string; // e.g. 'STUDENT', 'INSTRUCTOR', 'ADMIN'

  @Column({ type: 'uuid', nullable: true })
  courseId: string;

  @Column({ type: 'uuid' })
  senderId: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  campus: Campus;
}
