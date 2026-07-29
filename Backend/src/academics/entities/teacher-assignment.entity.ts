import { Campus } from '../../campuses/entities/campus.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Section } from './section.entity';
import { Subject } from './subject.entity';
import { User } from '../../users/entities/user.entity';

@Entity('teacher_assignments')
export class TeacherAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sectionId: string;

  @Column('uuid')
  subjectId: string;

  @Column('uuid')
  teacherId: string;

  @ManyToOne(() => Section, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sectionId' })
  section: Section;

  @ManyToOne(() => Subject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  campus: Campus;
}
