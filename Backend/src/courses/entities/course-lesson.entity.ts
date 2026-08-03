import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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
}
