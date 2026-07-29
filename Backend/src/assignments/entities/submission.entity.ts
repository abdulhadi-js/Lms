import { Campus } from '../../campuses/entities/campus.entity';
import { Index, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assignmentId: string;

  @Index()
  @Column()
  studentId: string;

  @Column({ nullable: true })
  textContent: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ nullable: true })
  grade: number;

  @Column({ nullable: true })
  feedback: string;

  @Column({ nullable: true })
  graderId: string;

  @CreateDateColumn()
  submittedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  campus: Campus;
}
