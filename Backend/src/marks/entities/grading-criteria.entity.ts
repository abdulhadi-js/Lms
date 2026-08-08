import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Campus } from '../../campuses/entities/campus.entity';

@Entity('grading_criteria')
export class GradingCriteria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  minScore: number;

  @Column({ type: 'float' })
  maxScore: number;

  @Column()
  gradeLetter: string;

  @Column({ type: 'float' })
  gpaPoints: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  @JoinColumn({ name: 'campusId' })
  campus: Campus;
}
