import { Index, 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
 } from 'typeorm';
import { CourseModule } from './module.entity';
import { User } from '../../users/entities/user.entity';

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

  @Column({ nullable: true, type: 'uuid' })
  teacherId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @Column({ default: 3 })
  credits: number;

  @Column({ default: 'ACTIVE' })
  status: string;

  @OneToMany(() => CourseModule, (module) => module.course)
  modules: CourseModule[];
}
