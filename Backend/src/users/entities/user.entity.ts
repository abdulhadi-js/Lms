import { Index, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserStatus } from '../../common/enums/status.enum';
import { Role } from '../../roles/entities/role.entity';
import { Campus } from '../../campuses/entities/campus.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index()
  @Column({ unique: true }) email: string;
  @Column() @Exclude() passwordHash: string;
  @Column({ default: false })
  isSuperAdmin: boolean;

  @Column({ nullable: true })
  roleId: string;

  @ManyToOne(() => Role, role => role.users, { nullable: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus, { nullable: true })
  @JoinColumn({ name: 'campusId' })
  campus: Campus;

  @Column({ type: 'varchar', default: UserStatus.ACTIVE })
  status: UserStatus;
  @Column() firstName: string;
  @Column() lastName: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) profilePicture: string;
  @Column({ type: 'simple-json', nullable: true }) metadata: Record<string, unknown>;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
