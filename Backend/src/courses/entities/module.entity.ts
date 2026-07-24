import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity('modules')
export class CourseModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  order: number;

  @Column()
  courseId: string;

  @ManyToOne(() => Course, course => course.modules)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @OneToMany(() => Lesson, lesson => lesson.module)
  lessons: Lesson[];
}
