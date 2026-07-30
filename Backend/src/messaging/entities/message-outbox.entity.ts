import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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
}
