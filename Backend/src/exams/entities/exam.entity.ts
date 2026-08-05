import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ExamQuestion } from './exam-question.entity';
import { ExamSubmission } from './exam-submission.entity';
import { Campus } from '../../campuses/entities/campus.entity';

export enum ExamStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
}

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'uuid', nullable: true })
  courseId: string;

  @Column({ type: 'int', default: 60 })
  durationMinutes: number;

  @Column({ type: 'int', default: 100 })
  totalMarks: number;

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'varchar', default: ExamStatus.DRAFT })
  status: ExamStatus;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus, { nullable: true })
  campus: Campus;

  @OneToMany(() => ExamQuestion, (eq) => eq.exam, { cascade: true })
  examQuestions: ExamQuestion[];

  @OneToMany(() => ExamSubmission, (es) => es.exam)
  submissions: ExamSubmission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
