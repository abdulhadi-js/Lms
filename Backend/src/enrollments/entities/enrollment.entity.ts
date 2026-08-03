import { Campus } from '../../campuses/entities/campus.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Section } from '../../academics/entities/section.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  studentId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Index()
  @Column({ nullable: true })
  sectionId: string;

  @ManyToOne(() => Section, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'sectionId' })
  section: Section;

  @Index()
  @Column({ nullable: true })
  courseId: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ default: 'ACTIVE' }) // ACTIVE, DROPPED, GRADUATED
  status: string;

  @Column({ nullable: true })
  academicYear: string; // e.g. "2026-2027"

  @Column({ nullable: true })
  dropReason: string;

  @Column({ nullable: true })
  droppedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  campus: Campus;
}
