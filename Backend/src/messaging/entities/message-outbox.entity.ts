import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Campus } from '../../campuses/entities/campus.entity';

export enum MessageStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

@Entity('message_outbox')
export class MessageOutbox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recipientPhone: string;

  @Column('text')
  content: string;

  @Column({ type: 'varchar', default: MessageStatus.PENDING })
  status: MessageStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  @JoinColumn({ name: 'campusId' })
  campus: Campus;
}
