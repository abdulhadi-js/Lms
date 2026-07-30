import { Campus } from '../../campuses/entities/campus.entity';
import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  sectionId: string;

  @Index()
  @Column('uuid')
  subjectId: string;

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
