import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    const app = this.appRepo.create({
      ...dto,
      status: 'PENDING',
      campusId: currentUser.campusId,
    });
    return this.appRepo.save(app);
  }

  async reviewApplication(
    id: string,
    dto: ReviewApplicationDto,
    currentUser: any,
  ) {
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
        throw new BadRequestException(
          'sectionId is required to enroll a student',
        );
      }

      console.log(
        `Audit: Admin ${currentUser.id} enrolling application ${id}. Creating user and enrollment.`,
      );
      try {
        let student = app.email
          ? await this.usersService.findByEmail(app.email)
          : null;
        if (!student) {
          const payload: any = {
            firstName: app.studentFirstName,
            lastName: app.studentLastName,
            email:
              app.email ||
              `${app.studentFirstName.toLowerCase()}.${app.phone}@example.com`,
            phone: app.phone,
            password: 'Password123!',
          };
          student = (await this.usersService.create(payload)) as any;
        }

        const enrollment = this.enrollmentRepo.create({
          status: 'ACTIVE',
          studentId: student!.id,
          sectionId: dto.sectionId,
          campusId: currentUser.campusId,
        });
        await this.enrollmentRepo.save(enrollment);
      } catch (e) {
        console.error('Failed to auto-enroll:', e);
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

  async directEnroll(dto: any, currentUser: any) {
    const enrollment = this.enrollmentRepo.create({
      status: 'ACTIVE',
      ...dto,
      campusId: currentUser.campusId,
    });
    return this.enrollmentRepo.save(enrollment);
  }

  async bulkEnroll(dto: { courseId?: string; sectionId?: string; studentIds: string[] }, currentUser: any) {
    const enrollments = dto.studentIds.map(studentId => {
      return this.enrollmentRepo.create({
        status: 'ACTIVE',
        studentId,
        courseId: dto.courseId,
        sectionId: dto.sectionId,
        campusId: currentUser.campusId,
      });
    });
    return this.enrollmentRepo.save(enrollments);
  }

  async requestDrop(currentUser: any, dto: RequestDropDto) {
    const whereClause: any = {
      id: dto.enrollmentId,
      studentId: currentUser.id,
    };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const enrollment = await this.enrollmentRepo.findOne({
      where: whereClause,
    });
    if (!enrollment) throw new NotFoundException();
    enrollment.status = 'DROP_REQUESTED';
    enrollment.dropReason = dto.reason;
    return this.enrollmentRepo.save(enrollment);
  }

  async reviewDropRequest(
    enrollmentId: string,
    approved: boolean,
    currentUser: any,
  ) {
    const whereClause: any = { id: enrollmentId };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const enrollment = await this.enrollmentRepo.findOne({
      where: whereClause,
    });
    if (!enrollment) throw new NotFoundException();

    if (approved) {
      enrollment.status = 'DROPPED';
      enrollment.droppedAt = new Date();
      console.log(
        `Audit: Admin ${currentUser.id} approved drop for ${enrollmentId}`,
      );
    } else {
      enrollment.status = 'ACTIVE';
      enrollment.dropReason = null as any;
      console.log(
        `Audit: Admin ${currentUser.id} rejected drop for ${enrollmentId}`,
      );
    }
    return this.enrollmentRepo.save(enrollment);
  }

  async adminDrop(enrollmentId: string, reason: string, currentUser: any) {
    const whereClause: any = { id: enrollmentId };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const enrollment = await this.enrollmentRepo.findOne({
      where: whereClause,
    });
    if (!enrollment) throw new NotFoundException();

    enrollment.status = 'DROPPED';
    enrollment.dropReason = reason;
    enrollment.droppedAt = new Date();
    await this.enrollmentRepo.save(enrollment);
    console.log(
      `Audit: Admin ${currentUser.id} directly dropped ${enrollmentId}`,
    );
    return enrollment;
  }

  async findEnrollments(currentUser: any, page: number = 1, limit: number = 0) {
    const whereClause: any = {};
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;

    const skip = (page - 1) * limit;
    const findOptions: any = {
      where: whereClause,
      relations: { student: true, section: { academicClass: true }, course: true },
    };

    if (limit > 0) {
      findOptions.skip = skip;
      findOptions.take = limit;
    }

    if (currentUser.permissions?.includes('VIEW_ENROLLMENTS')) {
      if (limit > 0) {
        const [data, total] = await this.enrollmentRepo.findAndCount(findOptions);
        return { data, total, page, limit };
      }
      return this.enrollmentRepo.find(findOptions);
    }
    // Assume student
    findOptions.where.studentId = currentUser.id;
    if (limit > 0) {
      const [data, total] = await this.enrollmentRepo.findAndCount(findOptions);
      return { data, total, page, limit };
    }
    return this.enrollmentRepo.find(findOptions);
  }

  async remove(id: string, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const existing = await this.enrollmentRepo.findOne({ where: whereClause });
    if (!existing) throw new NotFoundException();

    await this.enrollmentRepo.delete(id);
  }

  async rollover(
    data: { fromCourseId: string; toCourseId: string; studentIds?: string[] },
    currentUser: any,
  ) {
    const { fromCourseId, toCourseId, studentIds } = data;

    const qb = this.enrollmentRepo.createQueryBuilder('enrollment');
    qb.where('enrollment.sectionId = :fromCourseId', { fromCourseId });
    qb.andWhere('enrollment.status = :status', { status: 'ACTIVE' });
    if (!currentUser.isSuperAdmin) {
      qb.andWhere('enrollment.campusId = :campusId', {
        campusId: currentUser.campusId,
      });
    }
    if (studentIds && studentIds.length > 0) {
      qb.andWhere('enrollment.studentId IN (:...studentIds)', { studentIds });
    }

    const enrollments = await qb.getMany();

    if (enrollments.length === 0) {
      return { message: 'No active enrollments found to rollover', count: 0 };
    }

    const newEnrollments: Enrollment[] = [];

    for (const enrollment of enrollments) {
      // Mark current as completed
      enrollment.status = 'COMPLETED';
      await this.enrollmentRepo.save(enrollment);

      // Create new enrollment
      const newEnrollment = this.enrollmentRepo.create({
        studentId: enrollment.studentId,
        sectionId: toCourseId,
        status: 'ACTIVE',
        academicYear:
          new Date().getFullYear().toString() +
          '-' +
          (new Date().getFullYear() + 1).toString(),
        campusId: enrollment.campusId,
      });
      newEnrollments.push(newEnrollment);
    }

    await this.enrollmentRepo.save(newEnrollments);

    return {
      message: 'Rollover successful',
      count: newEnrollments.length,
    };
  }
}
