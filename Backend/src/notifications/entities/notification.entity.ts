import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ nullable: true })
  audienceRole: string; // e.g. 'STUDENT', 'TEACHER', 'ADMIN'

  @Column({ type: 'uuid', nullable: true })
  courseId: string;

  @Column({ type: 'uuid' })
  senderId: string;

  @CreateDateColumn()
  createdAt: Date;
}
