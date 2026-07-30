import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum MessageType {
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
}

@Entity('message_templates')
export class MessageTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar' })
  type: MessageType;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
