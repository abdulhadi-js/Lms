import { Index, 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
 } from 'typeorm';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  studentId: string;

  @Index()
  @Column()
  courseId: string;

  @Column({ default: 'ENROLLED' })
  status: string;

  @Column({ nullable: true })
  dropReason: string;

  @Column({ nullable: true })
  droppedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
