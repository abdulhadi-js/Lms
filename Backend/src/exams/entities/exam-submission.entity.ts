import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Campus } from '../../campuses/entities/campus.entity';
import { Exam } from './exam.entity';
import { User } from '../../users/entities/user.entity';

@Entity('exam_submissions')
export class ExamSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  examId: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @Column({ type: 'jsonb', nullable: true })
  answers: any; // JSON string or object mapping questionId -> studentAnswer

  @Column({ type: 'int', default: 0 })
  score: number;

  @ManyToOne(() => Exam, (exam) => exam.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @CreateDateColumn()
  submittedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  @JoinColumn({ name: 'campusId' })
  campus: Campus;
}
