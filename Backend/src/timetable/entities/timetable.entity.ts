import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('timetable')
export class Timetable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  courseId: string;

  @Column({ type: 'enum', enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] })
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
