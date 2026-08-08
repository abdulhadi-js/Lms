import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Campus } from '../../campuses/entities/campus.entity';

@Entity('staff_profiles')
export class StaffProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  qualifications: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ type: 'date', nullable: true })
  appointmentDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  basicSalary: number;

  @Column({ type: 'simple-json', nullable: true })
  allowances: any;

  @Column({ type: 'simple-json', nullable: true })
  deductions: any;

  @Column({ nullable: true })
  bankAccountDetails: string;

  @OneToOne(() => User, (user) => user.staffProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

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
