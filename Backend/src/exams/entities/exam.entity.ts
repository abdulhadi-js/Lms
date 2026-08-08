import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExamQuestion } from './exam-question.entity';
import { ExamSubmission } from './exam-submission.entity';
import { Campus } from '../../campuses/entities/campus.entity';
import { AcademicClass } from '../../academics/entities/academic-class.entity';
import { Subject } from '../../academics/entities/subject.entity';
import { User } from '../../users/entities/user.entity';

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

  @Column({ type: 'uuid', nullable: true })
  classId: string;

  @ManyToOne(() => AcademicClass, { nullable: true })
  academicClass: AcademicClass;

  @Column({ type: 'uuid', nullable: true })
  subjectId: string;

  @ManyToOne(() => Subject, { nullable: true })
  subject: Subject;

  @Column({ type: 'uuid', nullable: true })
  teacherId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

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
