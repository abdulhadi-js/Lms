import { Index, 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
 } from 'typeorm';
import { Role } from '../../common/enums/roles.enum';
import { UserStatus } from '../../common/enums/status.enum';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index()
  @Column({ unique: true }) email: string;
  @Column() @Exclude() passwordHash: string;
  @Index()
  @Column({ type: 'varchar' }) role: Role;

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
