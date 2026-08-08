import { Campus } from '../../campuses/entities/campus.entity';
import { User } from '../../users/entities/user.entity';
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
import { AcademicClass } from '../../academics/entities/academic-class.entity';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  studentId: string;

  @ManyToOne(() => User, (user) => user.attendances, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  classId: string;

  @ManyToOne(() => AcademicClass, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'classId' })
  academicClass: AcademicClass;

  @Column({ type: 'uuid', nullable: true })
  sectionId: string;

  @Column({ type: 'uuid', nullable: true })
  subjectId: string;

  @Column({ type: 'uuid', nullable: true })
  courseId: string;

  @Column({ type: 'date' })
  classDate: string;

  @Column({
    type: 'varchar',
  })
  status: AttendanceStatus;

  @Column({ nullable: true })
  notes: string;

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
