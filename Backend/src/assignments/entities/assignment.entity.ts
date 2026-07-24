import { Index,  Entity, PrimaryGeneratedColumn, Column  } from 'typeorm';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  courseId: string;

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
}
