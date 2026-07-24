import { Index,  Entity, PrimaryGeneratedColumn, Column  } from 'typeorm';

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
}
