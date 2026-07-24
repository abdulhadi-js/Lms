import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('marks')
export class Mark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @Column({ type: 'uuid' })
  courseId: string;

  @Column()
  component: string;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'float' })
  maxScore: number;

  @Column({ type: 'float' })
  weightPercent: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  overrideReason: string;

  @Column({ nullable: true })
  gradeLetter: string;

  @Column({ type: 'float', nullable: true })
  gpaPoints: number;

  @Column({ type: 'uuid', nullable: true })
  graderId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
