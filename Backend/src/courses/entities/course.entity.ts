import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Campus } from '../../campuses/entities/campus.entity';
import { CourseModule } from './course-module.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  code: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'int', default: 3 })
  credits: number;

  @Column('uuid', { nullable: true })
  teacherId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @Column('uuid', { nullable: true })
  classId: string;

  @Column('uuid', { nullable: true })
  sectionId: string;

  @OneToMany(() => CourseModule, mod => mod.course, { cascade: true })
  modules: CourseModule[];

  @Column('uuid', { nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  @JoinColumn({ name: 'campusId' })
  campus: Campus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
