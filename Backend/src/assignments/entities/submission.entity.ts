import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assignmentId: string;

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
}
