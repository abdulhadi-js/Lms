import { Campus } from '../../campuses/entities/campus.entity';
import { User } from '../../users/entities/user.entity';
import { Index, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('marks')
export class Mark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => User, user => user.marks)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column({ type: 'uuid' })
  sectionId: string;

  @Column({ type: 'uuid' })
  subjectId: string;

  @Column()
  component: string; // e.g. Midterm, Final, Homework 1

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

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  campus: Campus;
}
