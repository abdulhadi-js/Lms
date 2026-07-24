import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum FeeStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  REFUNDED = 'REFUNDED'
}

@Entity('fees')
export class Fee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @Column({ type: 'uuid', nullable: true })
  courseId: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'float', default: 0 })
  paidAmount: number;

  @Column({ type: 'enum', enum: FeeStatus, default: FeeStatus.PENDING })
  status: FeeStatus;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  refundReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
