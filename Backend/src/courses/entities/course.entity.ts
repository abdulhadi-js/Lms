import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { CourseModule } from './module.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  teacherId: string;

  @Column({ default: 3 })
  credits: number;

  @Column({ default: 'ACTIVE' })
  status: string;

  @OneToMany(() => CourseModule, module => module.course)
  modules: CourseModule[];
}
