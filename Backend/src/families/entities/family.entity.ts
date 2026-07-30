import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('families')
export class Family {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  familyCode: string;

  @Column()
  fatherName: string;

  @Column()
  fatherPhone: string;

  @Column({ nullable: true })
  motherName: string;

  @Column({ nullable: true })
  guardianName: string;

  @Column({ nullable: true })
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.family)
  users: User[];
}
