import { Campus } from '../../campuses/entities/campus.entity';
import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Section } from '../../academics/entities/section.entity';
import { AcademicClass } from '../../academics/entities/academic-class.entity';

export enum FeeStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  REFUNDED = 'REFUNDED',
}

@Entity('fees')
export class Fee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  sectionId: string;

  @ManyToOne(() => Section)
  @JoinColumn({ name: 'sectionId' })
  section: Section;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  classId: string;

  @ManyToOne(() => AcademicClass)
  @JoinColumn({ name: 'classId' })
  academicClass: AcademicClass;

  @Column({ type: 'float' })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  lateFee: number;

  @Column({ type: 'date', nullable: true })
  holdUntil: Date;

  @Column({ type: 'jsonb', nullable: true })
  installments: any;

  @Column({ type: 'float', default: 0 })
  paidAmount: number;

  @Column({ type: 'varchar', default: FeeStatus.PENDING })
  status: FeeStatus;

  @Column({ type: 'datetime', nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  refundReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  @JoinColumn({ name: 'campusId' })
  campus: Campus;
}
