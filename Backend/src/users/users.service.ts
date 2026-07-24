import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/roles.enum';

// Safe user shape without sensitive fields
export type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private sanitize(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user as any;
    return rest as SafeUser;
  }

  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const { password, ...rest } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);

    // Use raw save() — TypeORM accepts plain objects that match the schema
    const saved = await this.userRepo.save({ ...rest, passwordHash } as any);
    return this.sanitize(saved as User);
  }

  async findAll(role?: Role): Promise<SafeUser[]> {
    const qb = this.userRepo.createQueryBuilder('user');
    if (role) qb.where('user.role = :role', { role });
    const users = await qb.getMany();
    return users.map((u) => this.sanitize(u));
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return this.sanitize(user);
  }

  /** Returns the full entity including passwordHash — for AuthService use only */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException(`No user with email: ${email}`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<SafeUser> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);

    const { password, ...rest } = updateUserDto as any;
    Object.assign(user, rest);

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    const saved = await this.userRepo.save(user);
    return this.sanitize(saved);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    (user as any).status = 'INACTIVE';
    await this.userRepo.save(user);
    return { success: true };
  }

  async resetPassword(
    id: string,
    newPassword: string,
  ): Promise<{ success: boolean }> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);
    return { success: true };
  }
}
