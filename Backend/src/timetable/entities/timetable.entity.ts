import { Index, 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
 } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity('timetable')
export class Timetable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  courseId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ type: 'varchar' })
  dayOfWeek: string;

  @Column()
  startTime: string; // e.g., '09:00'

  @Column()
  endTime: string; // e.g., '10:30'

  @Column()
  room: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
