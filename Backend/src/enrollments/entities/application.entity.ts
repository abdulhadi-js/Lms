import { Campus } from '../../campuses/entities/campus.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  studentFirstName: string;

  @Column({ nullable: true })
  studentLastName: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  fatherName: string;

  @Column({ nullable: true })
  fatherCnic: string;

  @Column({ nullable: true })
  phone: string; // WhatsApp

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  previousSchool: string;

  @Column({ type: 'uuid', nullable: true })
  desiredClassId: string; // Links to AcademicClass

  @Column({ default: 'PENDING' }) // PENDING, TEST_SCHEDULED, APPROVED_WAITING_FEE, ENROLLED, REJECTED
  status: string;

  @Column({ type: 'date', nullable: true })
  testDate: Date;

  @Column({ type: 'float', nullable: true })
  testMarks: number;

  @Column({ nullable: true })
  reviewNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  campus: Campus;
}
