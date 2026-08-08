import { Campus } from '../../campuses/entities/campus.entity';
import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { AcademicClass } from '../../academics/entities/academic-class.entity';
import { Subject } from '../../academics/entities/subject.entity';
import { Section } from '../../academics/entities/section.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
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
  sectionId: string;

  @ManyToOne(() => Section, { nullable: true })
  section: Section;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('jsonb', { nullable: true })
  rubric: any;

  @Column()
  maxMarks: number;

  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  weightPercent: number;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  campus: Campus;
}
