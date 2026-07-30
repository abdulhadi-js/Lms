import { Campus } from '../../campuses/entities/campus.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AcademicClass } from './academic-class.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., "English", "Physics"

  @Column({ nullable: true })
  code: string;

  @Column('uuid')
  classId: string;

  @ManyToOne(() => AcademicClass, (academicClass) => academicClass.subjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'classId' })
  academicClass: AcademicClass;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  campus: Campus;
}
