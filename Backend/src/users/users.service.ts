import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import ImageKit from 'imagekit';
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
    private readonly configService: ConfigService,
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

  async findAll(role?: Role, limit: number = 50, offset: number = 0): Promise<SafeUser[]> {
    const qb = this.userRepo.createQueryBuilder('user');
    if (role) qb.where('user.role = :role', { role });
    const users = await qb.take(limit).skip(offset).getMany();
    return users.map((u) => this.sanitize(u));
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return this.sanitize(user);
  }

  /** Returns the full entity including passwordHash — for AuthService use only */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } });
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

  async updateProfile(id: string, body: any, file?: Express.Multer.File): Promise<SafeUser> {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) throw new NotFoundException('User not found');

      if (body.firstName) user.firstName = body.firstName;
      if (body.lastName) user.lastName = body.lastName;
      if (body.phone) user.phone = body.phone;
      
      if (body.currentPassword && body.newPassword) {
        const isMatch = await bcrypt.compare(body.currentPassword, user.passwordHash);
        if (!isMatch) throw new BadRequestException('Invalid current password');
        user.passwordHash = await bcrypt.hash(body.newPassword, 10);
      }

      if (file) {
        const pubKey = this.configService.get('IMAGEKIT_PUBLIC_KEY');
        const hasImageKit = pubKey && pubKey !== 'dummy_public_key';

        if (hasImageKit) {
          const imagekit = new ImageKit({
            publicKey: pubKey,
            privateKey: this.configService.get('IMAGEKIT_PRIVATE_KEY') || 'dummy_private_key',
            urlEndpoint: this.configService.get('IMAGEKIT_URL_ENDPOINT') || 'https://ik.imagekit.io/dummy_endpoint'
          });

          const uploadResponse = await new Promise((resolve, reject) => {
            imagekit.upload({
              file: file.buffer,
              fileName: file.originalname,
              folder: '/educore/profiles'
            }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            });
          });

          user.profilePicture = (uploadResponse as any).url;
        } else {
          // Fallback to local storage
          const fs = require('fs');
          const path = require('path');
          const uploadDir = path.join(process.cwd(), 'uploads', 'profiles');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const filePath = path.join(uploadDir, fileName);
          fs.writeFileSync(filePath, file.buffer);
          user.profilePicture = `/uploads/profiles/${fileName}`;
        }
      }

      const saved = await this.userRepo.save(user);
      return this.sanitize(saved);
    } catch (error: any) {
      // Re-throw NestJS HTTP exceptions as-is (e.g. NotFoundException, BadRequestException)
      if (error?.status) throw error;
      // For all other unexpected errors, throw a safe generic message — never expose stack traces
      throw new BadRequestException('Failed to update profile. Please try again.');
    }
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
