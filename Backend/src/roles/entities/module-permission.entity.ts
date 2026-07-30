import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

export enum ModuleId {
  DASHBOARD = 'DASHBOARD',
  CAMPUSES = 'CAMPUSES',
  ROLES = 'ROLES',
  ACADEMICS = 'ACADEMICS',
  USERS_STAFF = 'USERS_STAFF',
  USERS_STUDENTS = 'USERS_STUDENTS',
  FEES = 'FEES',
  ACCOUNTS = 'ACCOUNTS',
  ATTENDANCE = 'ATTENDANCE',
  EXAMS = 'EXAMS',
  REPORTS = 'REPORTS',
  MESSAGING = 'MESSAGING',
  ADMISSIONS = 'ADMISSIONS',
}

@Entity('module_permissions')
export class ModulePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.matrix, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ type: 'enum', enum: ModuleId })
  moduleId: ModuleId;

  @Column({ default: false })
  canView: boolean;

  @Column({ default: false })
  canAdd: boolean;

  @Column({ default: false })
  canEdit: boolean;

  @Column({ default: false })
  canDelete: boolean;

  @Column({ type: 'jsonb', nullable: true })
  specialFlags: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
