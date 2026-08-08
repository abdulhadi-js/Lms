import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Campus } from '../../campuses/entities/campus.entity';
import { CourseModule } from './course-module.entity';

@Entity('course_lessons')
export class CourseLesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: 'DOCUMENT' })
  contentType: string; // VIDEO, PDF, DOCUMENT

  @Column({ nullable: true })
  contentUrl: string;

  @Column('uuid')
  moduleId: string;

  @ManyToOne(() => CourseModule, mod => mod.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'moduleId' })
  module: CourseModule;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  campus: Campus;
}
