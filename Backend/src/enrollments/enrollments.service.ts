import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Application } from './entities/application.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { RequestDropDto } from './dto/request-drop.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Application) private appRepo: Repository<Application>,
    private readonly usersService: UsersService,
  ) {}

  async apply(dto: CreateApplicationDto, currentUser: any) {
    const app = this.appRepo.create({ ...dto, status: 'PENDING', campusId: currentUser.campusId });
    return this.appRepo.save(app);
  }

  async reviewApplication(id: string, dto: ReviewApplicationDto, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const app = await this.appRepo.findOne({ where: whereClause });
    if (!app) throw new NotFoundException('Application not found');

    if (dto.status) app.status = dto.status;
    if (dto.testDate) app.testDate = dto.testDate;
    if (dto.testMarks !== undefined) app.testMarks = dto.testMarks;
    if (dto.reviewNotes) app.reviewNotes = dto.reviewNotes;

    if (dto.status === 'ENROLLED') {
      if (!dto.sectionId) {
        throw new BadRequestException('sectionId is required to enroll a student');
      }

      console.log(`Audit: Admin ${currentUser.id} enrolling application ${id}. Creating user and enrollment.`);
      try {
        let student = app.email ? await this.usersService.findByEmail(app.email) : null;
        if (!student) {
          student = await this.usersService.create({
            firstName: app.studentFirstName,
            lastName: app.studentLastName,
            email: app.email || `${app.studentFirstName.toLowerCase()}.${app.phone}@example.com`,
            phone: app.phone,
            password: 'Password123!',
            role: 'STUDENT' as any,
          }) as any;
        }

        const enrollment = this.enrollmentRepo.create({
          status: 'ACTIVE',
          studentId: student!.id,
          sectionId: dto.sectionId,
          campusId: currentUser.campusId,
        });
        await this.enrollmentRepo.save(enrollment);
      } catch (e) {
        console.error("Failed to auto-enroll:", e);
        throw new BadRequestException('Failed to create user/enrollment');
      }
    }

    return this.appRepo.save(app);
  }

  async getApplications(status: string | undefined, currentUser: any) {
    const whereClause: any = {};
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    if (status) whereClause.status = status;
    return this.appRepo.find({ where: whereClause });
  }

  async directEnroll(dto: CreateEnrollmentDto, currentUser: any) {
    const enrollment = this.enrollmentRepo.create({
      status: 'ACTIVE',
      ...dto,
      campusId: currentUser.campusId,
    });
    return this.enrollmentRepo.save(enrollment);
  }

  async requestDrop(currentUser: any, dto: RequestDropDto) {
    const whereClause: any = { id: dto.enrollmentId, studentId: currentUser.id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const enrollment = await this.enrollmentRepo.findOne({ where: whereClause });
    if (!enrollment) throw new NotFoundException();
    enrollment.status = 'DROP_REQUESTED';
    enrollment.dropReason = dto.reason;
    return this.enrollmentRepo.save(enrollment);
  }

  async reviewDropRequest(enrollmentId: string, approved: boolean, currentUser: any) {
    const whereClause: any = { id: enrollmentId };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const enrollment = await this.enrollmentRepo.findOne({ where: whereClause });
    if (!enrollment) throw new NotFoundException();

    if (approved) {
      enrollment.status = 'DROPPED';
      enrollment.droppedAt = new Date();
      console.log(`Audit: Admin ${currentUser.id} approved drop for ${enrollmentId}`);
    } else {
      enrollment.status = 'ACTIVE';
      enrollment.dropReason = null as any;
      console.log(`Audit: Admin ${currentUser.id} rejected drop for ${enrollmentId}`);
    }
    return this.enrollmentRepo.save(enrollment);
  }

  async adminDrop(enrollmentId: string, reason: string, currentUser: any) {
    const whereClause: any = { id: enrollmentId };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const enrollment = await this.enrollmentRepo.findOne({ where: whereClause });
    if (!enrollment) throw new NotFoundException();
    
    enrollment.status = 'DROPPED';
    enrollment.dropReason = reason;
    enrollment.droppedAt = new Date();
    await this.enrollmentRepo.save(enrollment);
    console.log(`Audit: Admin ${currentUser.id} directly dropped ${enrollmentId}`);
    return enrollment;
  }

  async findEnrollments(currentUser: any) {
    const whereClause: any = {};
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;

    if (currentUser.permissions?.includes('VIEW_ENROLLMENTS')) {
      return this.enrollmentRepo.find({ where: whereClause, relations: { student: true, section: { academicClass: true } } });
    }
    // Assume student
    whereClause.studentId = currentUser.id;
    return this.enrollmentRepo.find({ 
      where: whereClause, 
      relations: { section: { academicClass: true } } 
    });
  }

  async remove(id: string, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const existing = await this.enrollmentRepo.findOne({ where: whereClause });
    if (!existing) throw new NotFoundException();
    
    await this.enrollmentRepo.delete(id);
  }
}
