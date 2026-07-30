import { Campus } from '../../campuses/entities/campus.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Section } from './section.entity';
import { Subject } from './subject.entity';

@Entity('academic_classes')
export class AcademicClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., "Class 6" or "Matric Science"

  @Column({ default: 0 })
  level: number; // for sorting (e.g., 6)

  @OneToMany(() => Section, (section) => section.academicClass)
  sections: Section[];

  @OneToMany(() => Subject, (subject) => subject.academicClass)
  subjects: Subject[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  campus: Campus;
}
