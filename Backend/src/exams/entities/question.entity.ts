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
import { Campus } from '../../campuses/entities/campus.entity';
import { AcademicClass } from '../../academics/entities/academic-class.entity';
import { Subject } from '../../academics/entities/subject.entity';

export enum QuestionType {
  MCQ = 'MCQ',
  TRUE_FALSE = 'TRUE_FALSE',
  ESSAY = 'ESSAY',
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar', default: QuestionType.MCQ })
  type: QuestionType;

  @Column({ type: 'jsonb', nullable: true })
  options: any; // JSON array of options for MCQ

  @Column({ type: 'text' })
  correctAnswer: string;

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

  @Column({ nullable: true })
  chapter: string;

  @Column({ nullable: true })
  topic: string;

  @Column({ type: 'varchar', default: DifficultyLevel.MEDIUM })
  difficulty: DifficultyLevel;

  @Column({ type: 'int', default: 1 })
  marks: number;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus, { nullable: true })
  campus: Campus;

  @OneToMany(() => ExamQuestion, (eq) => eq.question)
  examQuestions: ExamQuestion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
