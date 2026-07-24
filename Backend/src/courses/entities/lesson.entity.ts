import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CourseModule } from './module.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  contentType: string;

  @Column({ nullable: true })
  contentUrl: string;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  duration: number;

  @Column()
  moduleId: string;

  @ManyToOne(() => CourseModule, (module) => module.lessons)
  @JoinColumn({ name: 'moduleId' })
  module: CourseModule;
}
