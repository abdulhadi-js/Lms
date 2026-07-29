import { Campus } from '../../campuses/entities/campus.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AcademicClass } from './academic-class.entity';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., "A", "Blue"

  @Column('uuid')
  classId: string;

  @ManyToOne(() => AcademicClass, academicClass => academicClass.sections, { onDelete: 'CASCADE' })
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
