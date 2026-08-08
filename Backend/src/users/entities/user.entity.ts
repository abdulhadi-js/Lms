import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserStatus } from '../../common/enums/status.enum';
import { Role } from '../../roles/entities/role.entity';
import { Campus } from '../../campuses/entities/campus.entity';
import { Family } from '../../families/entities/family.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Fee } from '../../fees/entities/fee.entity';
import { Mark } from '../../marks/entities/mark.entity';
import { StaffProfile } from '../../hr/entities/staff-profile.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Department } from '../../departments/entities/department.entity';
import { AcademicClass } from '../../academics/entities/academic-class.entity';
import { Section } from '../../academics/entities/section.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index()
  @Column({ unique: true })
  email: string;
  @Column() @Exclude() passwordHash: string;
  @Column({ default: false })
  isSuperAdmin: boolean;

  @Index()
  @Column({ nullable: true })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.users, { nullable: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus, { nullable: true })
  @JoinColumn({ name: 'campusId' })
  campus: Campus;

  @Column({ type: 'uuid', nullable: true })
  familyId: string;

  @ManyToOne(() => Family, (family) => family.users, { nullable: true })
  @JoinColumn({ name: 'familyId' })
  family: Family;

  @Column({ type: 'varchar', default: UserStatus.ACTIVE })
  status: UserStatus;
  @Column() firstName: string;
  @Column() lastName: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) dateOfBirth: Date;
  @Column({ nullable: true }) gender: string;
  @Column({ nullable: true }) profilePicture: string;

  // New Staff Fields
  @Column({ type: 'uuid', nullable: true })
  departmentId: string;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ default: false })
  isTeachingStaff: boolean;

  // New Student Fields
  @Column({ nullable: true })
  previousSchool: string;

  @Index()
  @Column({ nullable: true })
  grNumber: string;

  @Column({ nullable: true })
  bFormNumber: string;

  @Column({ nullable: true })
  bloodGroup: string;

  @Column({ nullable: true })
  religion: string;

  @Column({ nullable: true })
  domicile: string;

  // Primary class and section for traditional school models
  @Column({ type: 'uuid', nullable: true })
  classId: string;

  @ManyToOne(() => AcademicClass, { nullable: true })
  @JoinColumn({ name: 'classId' })
  academicClass: AcademicClass;

  @Column({ type: 'uuid', nullable: true })
  sectionId: string;

  @ManyToOne(() => Section, { nullable: true })
  @JoinColumn({ name: 'sectionId' })
  section: Section;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;
  @Column({ type: 'simple-json', nullable: true }) metadata: Record<
    string,
    unknown
  >;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => Fee, (fee) => fee.student)
  fees: Fee[];

  @OneToMany(() => Mark, (mark) => mark.student)
  marks: Mark[];

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];

  @OneToOne(() => StaffProfile, (staffProfile) => staffProfile.user)
  staffProfile: StaffProfile;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
