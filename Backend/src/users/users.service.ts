import { Campus } from '../campuses/entities/campus.entity';
import { Section } from '../academics/entities/section.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { StaffProfile } from '../hr/entities/staff-profile.entity';
import { Family } from '../families/entities/family.entity';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import ImageKit from 'imagekit';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { parseString } from 'fast-csv';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
import { FamiliesService } from '../families/families.service';

// Safe user shape without sensitive fields
export type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);
  private mailerTransport: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private readonly familiesService: FamiliesService,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    // Build a single SMTP transporter once at startup instead of per email
    if (this.configService.get('MAIL_HOST')) {
      this.mailerTransport = nodemailer.createTransport({
        host: this.configService.get('MAIL_HOST'),
        port: this.configService.get<number>('MAIL_PORT'),
        secure: true,
        auth: {
          user: this.configService.get('MAIL_USER'),
          pass: this.configService.get('MAIL_PASS'),
        },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      this.mailerTransport = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      this.logger.debug('Using Ethereal test mail account (dev only)');
    }
  }

  private sanitize(user: User): SafeUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user as any;
    return rest as SafeUser;
  }

  private async sendWelcomeEmail(user: User, rawPassword?: string) {
    try {
      const roleName = user.role?.name
        ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1).toLowerCase()
        : 'User';

      const pwdHtml = rawPassword
        ? `<p>Your temporary password is: <strong>${rawPassword}</strong></p><p>Please log in and change it immediately.</p>`
        : '';

      const info = await this.mailerTransport.sendMail({
        from: this.configService.get('MAIL_FROM') || '"EduCore Admissions" <admissions@educore.school>',
        to: user.email,
        subject: `Welcome to EduCore! Your ${roleName} Account is Ready`,
        html: `
          <h2>Welcome to EduCore LMS!</h2>
          <p>Dear ${user.firstName},</p>
          <p>Your account has been successfully created with the role: <strong>${roleName}</strong>.</p>
          ${pwdHtml}
          <br/>
          <p>Regards,<br/>The EduCore Team</p>
        `,
      });

      this.logger.log(`Welcome email sent to ${user.email} (messageId: ${info.messageId})`);
      if (!this.configService.get('MAIL_HOST')) {
        this.logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error: any) {
      this.logger.error(`Failed to send welcome email to ${user.email}`, error.stack);
    }
  }

  private async sendRoleUpdateEmail(user: User, newRole: Role) {
    try {
      const roleName = newRole.name.charAt(0).toUpperCase() + newRole.name.slice(1).toLowerCase();

      const info = await this.mailerTransport.sendMail({
        from: '"EduCore LMS" <no-reply@educore.com>',
        to: user.email,
        subject: `EduCore LMS: Your Role Has Been Updated`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #2F5233; margin-top: 0;">Role Update Notification</h2>
            <p>Dear ${user.firstName},</p>
            <p>Your account role in the EduCore LMS has been successfully updated to: <strong style="color: #1a56db;">${roleName}</strong>.</p>
            <p>Your new permissions will take effect the next time you log in.</p>
            <p>If you have any questions or believe this was a mistake, please contact your administrator.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 0;">This is an automated message from EduCore LMS.</p>
          </div>
        `,
      });

      this.logger.log(`Role update email sent to ${user.email} (messageId: ${info.messageId})`);
      if (!this.configService.get('MAIL_HOST')) {
        this.logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error: any) {
      this.logger.error(`Failed to send role update email to ${user.email}`, error.stack);
    }
  }

  async create(createUserDto: CreateUserDto, currentUser: any): Promise<SafeUser> {
    if (!currentUser.isSuperAdmin && currentUser.campusId) {
      createUserDto.campusId = currentUser.campusId;
    }
    const {
      password,
      familyCode,
      fatherName,
      fatherPhone,
      motherName,
      guardianName,
      address,
      ...rest
    } = createUserDto;

    const existingUser = await this.userRepo.findOne({
      where: { email: rest.email },
    });
    if (existingUser) {
      throw new BadRequestException('A user with this email already exists.');
    }

    let familyId: string | undefined = undefined;

    if (familyCode) {
      const family = await this.familiesService.findByCode(familyCode);
      if (family) {
        familyId = family.id;
      } else {
        const newFamily = await this.familiesService.create({
          familyCode,
          fatherName: fatherName || 'Unknown',
          fatherPhone: fatherPhone || 'Unknown',
          motherName,
          guardianName,
          address,
        });
        familyId = newFamily.id;
      }
    } else if (fatherName && fatherPhone) {
      const newFamily = await this.familiesService.create({
        fatherName,
        fatherPhone,
        motherName,
        guardianName,
        address,
      });
      familyId = newFamily.id;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Use raw save() — TypeORM accepts plain objects that match the schema
    const saved = await this.userRepo.save({
      ...rest,
      familyId,
      passwordHash,
    } as any);

    // Send welcome email asynchronously without blocking the request
    this.sendWelcomeEmail(saved as User, password);

    return this.sanitize(saved as User);
  }

  async findAll(
    roleId: string | undefined,
    limit: number = 50,
    offset: number = 0,
    currentUser: any,
  ): Promise<SafeUser[]> {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.campus', 'campus');
    if (roleId) qb.where('user.roleId = :roleId', { roleId });
    if (!currentUser.isSuperAdmin && currentUser.campusId) {
      qb.andWhere('user.campusId = :campusId', { campusId: currentUser.campusId });
    }
    const users = await qb.take(limit).skip(offset).getMany();
    return users.map((u) => this.sanitize(u));
  }

  async findOne(id: string, currentUser: any): Promise<SafeUser> {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin && currentUser.campusId) {
      whereClause.campusId = currentUser.campusId;
    }
    const user = await this.userRepo.findOne({
      where: whereClause,
      relations: { role: { matrix: true }, campus: true },
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return this.sanitize(user);
  }

  async getUnifiedStudentProfile(id: string, currentUser: any): Promise<SafeUser> {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin && currentUser.campusId) {
      whereClause.campusId = currentUser.campusId;
    }
    const user = await this.userRepo.findOne({
      where: whereClause,
      relations: {
        campus: true,
        family: { users: true },
        enrollments: { section: true },
        fees: true,
        marks: true,
        attendances: true,
      },
    });
    if (!user) throw new NotFoundException(`Student #${id} not found`);
    return this.sanitize(user);
  }

  /** Returns the full entity including passwordHash — for AuthService use only */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { email },
      relations: { role: { matrix: true }, campus: true },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUser: any): Promise<SafeUser> {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin && currentUser.campusId) {
      whereClause.campusId = currentUser.campusId;
    }
    const user = await this.userRepo.findOne({ where: whereClause, relations: { role: true } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    
    const oldRoleId = user.roleId;

    const { password, ...rest } = updateUserDto as any;
    Object.assign(user, rest);

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    const saved = await this.userRepo.save(user);

    // Send email notification if role changed
    if (updateUserDto.roleId && updateUserDto.roleId !== oldRoleId) {
      try {
        const newRole = await this.dataSource.getRepository(Role).findOne({ where: { id: updateUserDto.roleId } });
        if (newRole) {
          await this.sendRoleUpdateEmail(saved, newRole);
        }
      } catch (emailErr) {
        console.error('Failed to send role update email:', emailErr);
      }
    }

    return this.sanitize(saved);
  }

  async updateProfile(
    id: string,
    body: any,
    file?: Express.Multer.File,
  ): Promise<SafeUser> {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) throw new NotFoundException('User not found');

      if (body.firstName) user.firstName = body.firstName;
      if (body.lastName) user.lastName = body.lastName;
      if (body.phone) user.phone = body.phone;

      if (body.currentPassword && body.newPassword) {
        const isMatch = await bcrypt.compare(
          body.currentPassword,
          user.passwordHash,
        );
        if (!isMatch) throw new BadRequestException('Invalid current password');
        user.passwordHash = await bcrypt.hash(body.newPassword, 10);
      }

      if (file) {
        const pubKey = this.configService.get('IMAGEKIT_PUBLIC_KEY');
        const hasImageKit = pubKey && pubKey !== 'dummy_public_key';

        if (hasImageKit) {
          const imagekit = new ImageKit({
            publicKey: pubKey,
            privateKey:
              this.configService.get('IMAGEKIT_PRIVATE_KEY') ||
              'dummy_private_key',
            urlEndpoint:
              this.configService.get('IMAGEKIT_URL_ENDPOINT') ||
              'https://ik.imagekit.io/dummy_endpoint',
          });

          const uploadResponse = await new Promise((resolve, reject) => {
            imagekit.upload(
              {
                file: file.buffer,
                fileName: file.originalname,
                folder: '/educore/profiles',
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              },
            );
          });

          user.profilePicture = (uploadResponse as any).url;
        } else {
          // Fallback to local storage (fs/path imported at top of file)
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
      throw new BadRequestException(
        'Failed to update profile. Please try again.',
      );
    }
  }

  async remove(id: string, currentUser: any): Promise<{ success: boolean }> {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin && currentUser.campusId) {
      whereClause.campusId = currentUser.campusId;
    }
    const user = await this.userRepo.findOne({ where: whereClause });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    (user as any).status = 'INACTIVE';
    await this.userRepo.save(user);
    return { success: true };
  }

  async resetPassword(
    id: string,
    newPassword: string,
    currentUser: any,
  ): Promise<{ success: boolean }> {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin && currentUser.campusId) {
      whereClause.campusId = currentUser.campusId;
    }
    const user = await this.userRepo.findOne({ where: whereClause });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);
    return { success: true };
  }

  async bulkImport(fileBuffer: Buffer, currentUser: any): Promise<{ success: boolean; count: number; errors: string[] }> {
    return new Promise((resolve, reject) => {
      const rows: any[] = [];
      const errors: string[] = [];
      
      const csvString = fileBuffer.toString('utf8');
      
      parseString(csvString, { headers: true, ignoreEmpty: true })
        .on('data', (row) => rows.push(row))
        .on('end', async () => {
          const runner = this.dataSource.createQueryRunner();
          await runner.connect();
          await runner.startTransaction();
          
          let count = 0;
          try {
            // ── Phase 2 Optimization: Pre-load all lookups into Maps ──────────
            // Eliminates N+1 queries (was 4 queries/row → 4 queries total)
            const allCampuses = await runner.manager.find(Campus);
            const campusMap = new Map(allCampuses.map(c => [c.code, c]));

            const allRoles = await runner.manager.find(Role);
            const roleMap = new Map(allRoles.map(r => [r.name.toUpperCase(), r]));

            const allSections = await runner.manager.find(Section);
            const sectionMap = new Map(allSections.map(s => [s.name, s]));

            const emailsInCsv = rows.map(r => r.email).filter(Boolean);
            const existingUsers = emailsInCsv.length > 0
              ? await runner.manager.find(User, { where: emailsInCsv.map(e => ({ email: e })) })
              : [];
            const existingEmails = new Set(existingUsers.map(u => u.email));
            // ─────────────────────────────────────────────────────────────────

            for (let i = 0; i < rows.length; i++) {
              const row = rows[i];
              const rowNum = i + 2;
              
              if (!row.role || !row.firstName || !row.email || !row.campusCode) {
                errors.push(`Row ${rowNum}: Missing required fields`);
                continue;
              }
              
              if (existingEmails.has(row.email)) {
                errors.push(`Row ${rowNum}: Email already exists`);
                continue;
              }
              
              const campus = campusMap.get(row.campusCode);
              if (!campus) {
                errors.push(`Row ${rowNum}: Campus not found`);
                continue;
              }
              
              // Generate a secure random temporary password and email it to the user
              const tempPassword = crypto.randomBytes(8).toString('base64url');
              const passwordHash = await bcrypt.hash(tempPassword, 10);
              // Store temp password to send in welcome email after user is saved
              (row as any)._tempPassword = tempPassword;
              const roleName = row.role.toUpperCase();
              
              const roleEntity = roleMap.get(roleName);
              if (!roleEntity && roleName !== 'STUDENT') {
                errors.push(`Row ${rowNum}: Role not found`);
                continue;
              }

              let familyId: string | undefined = undefined;
              
              if (roleName === 'STUDENT') {
                if (!row.sectionCode) {
                  errors.push(`Row ${rowNum}: sectionCode is required for students`);
                  continue;
                }
                const section = sectionMap.get(row.sectionCode);
                if (!section) {
                  errors.push(`Row ${rowNum}: Section not found`);
                  continue;
                }
                
                let family = null;
                if (row.fatherPhone) {
                  family = await runner.manager.findOne(Family, { where: { fatherPhone: row.fatherPhone }});
                  if (!family) {
                    family = runner.manager.create(Family, {
                      familyCode: 'FAM-' + Date.now() + Math.floor(Math.random()*100),
                      fatherName: row.fatherName || 'Unknown',
                      fatherPhone: row.fatherPhone,
                      motherName: row.motherName
                    });
                    family = await runner.manager.save(family);
                  }
                }
                familyId = family ? family.id : undefined;
                
                const user = runner.manager.create(User, {
                  firstName: row.firstName,
                  lastName: row.lastName || '',
                  email: row.email,
                  phone: row.phone,
                  passwordHash,
                  campusId: campus.id,
                  familyId
                });
                const savedUser = await runner.manager.save(user);
                
                const enrollment = runner.manager.create(Enrollment, {
                  studentId: savedUser.id,
                  sectionId: section.id,
                  status: 'ENROLLED',
                  enrollmentDate: new Date(),
                  campusId: campus.id
                });
                await runner.manager.save(enrollment);
                count++;
                
              } else if (roleName === 'TEACHER' || roleName === 'ADMIN') {
                const user = runner.manager.create(User, {
                  firstName: row.firstName,
                  lastName: row.lastName || '',
                  email: row.email,
                  phone: row.phone,
                  passwordHash,
                  campusId: campus.id,
                  roleId: roleEntity?.id
                });
                const savedUser = await runner.manager.save(user);
                
                if (roleName === 'TEACHER') {
                  const profile = runner.manager.create(StaffProfile, {
                    userId: savedUser.id,
                    basicSalary: row.basicSalary ? parseFloat(row.basicSalary) : 0,
                    qualifications: row.qualifications || '',
                    experience: row.experience || ''
                  });
                  await runner.manager.save(profile);
                }
                count++;
              }
            }
            
            if (errors.length > 0 && count === 0) {
              await runner.rollbackTransaction();
            } else {
              await runner.commitTransaction();
            }
          } catch (e: any) {
            await runner.rollbackTransaction();
            errors.push('Transaction Failed: ' + e.message);
          } finally {
            await runner.release();
          }
          
          resolve({ success: true, count, errors });
        })
        .on('error', (err) => {
          reject(new BadRequestException('Invalid CSV file: ' + err.message));
        });
    });
  }

}
