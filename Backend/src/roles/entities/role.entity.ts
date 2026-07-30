import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ModulePermission } from './module-permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => ModulePermission, (mp) => mp.role, { cascade: true })
  matrix: ModulePermission[];

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @Column({ default: false })
  isSystem: boolean;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
