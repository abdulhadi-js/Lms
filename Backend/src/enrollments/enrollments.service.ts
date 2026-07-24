import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Application } from './entities/application.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { RequestDropDto } from './dto/request-drop.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Application) private appRepo: Repository<Application>,
  ) {}

  async directEnroll(dto: CreateEnrollmentDto) {
    const enrollment = this.enrollmentRepo.create(dto);
    await this.enrollmentRepo.save(enrollment);
    console.log(
      `Audit: Direct enroll for student ${dto.studentId} in course ${dto.courseId}`,
    );
    return enrollment;
  }

  async applyForCourse(dto: CreateApplicationDto) {
    const app = this.appRepo.create({ ...dto, status: 'PENDING_REVIEW' });
    return this.appRepo.save(app);
  }

  async reviewApplication(
    id: string,
    dto: ReviewApplicationDto,
    adminId: string,
  ) {
    const app = await this.appRepo.findOne({ where: { id } });
    if (!app) throw new NotFoundException();
    app.status = dto.status;
    app.reviewNotes = dto.notes ?? '';
    await this.appRepo.save(app);

    if (dto.status === 'APPROVED') {
      console.log(
        `Audit: Admin ${adminId} approved application ${id}. Creating enrollment.`,
      );
      // Use Object.assign to bypass strict TypeORM typing during testing
      const enrollment = this.enrollmentRepo.create();
      Object.assign(enrollment, {
        status: 'ENROLLED' as any,
        enrolledAt: new Date(),
      });
      await this.enrollmentRepo.save(enrollment);
    } else {
      console.log(`Audit: Admin ${adminId} rejected application ${id}`);
    }
    return app;
  }

  async getApplications(status?: string) {
    return status
      ? this.appRepo.find({ where: { status } })
      : this.appRepo.find();
  }

  async requestDrop(
    studentId: string,
    enrollmentId: string,
    dto: RequestDropDto,
  ) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { id: enrollmentId, studentId },
    });
    if (!enrollment) throw new NotFoundException();
    enrollment.status = 'DROP_REQUESTED';
    enrollment.dropReason = dto.reason;
    await this.enrollmentRepo.save(enrollment);
    console.log(
      `Audit: Student ${studentId} requested drop for enrollment ${enrollmentId}`,
    );
    return enrollment;
  }

  async reviewDropRequest(
    enrollmentId: string,
    approved: boolean,
    adminId: string,
  ) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { id: enrollmentId },
    });
    if (!enrollment) throw new NotFoundException();
    if (approved) {
      enrollment.status = 'DROPPED';
      enrollment.droppedAt = new Date();
      console.log(`Audit: Admin ${adminId} approved drop for ${enrollmentId}`);
    } else {
      enrollment.status = 'ENROLLED';
      console.log(`Audit: Admin ${adminId} rejected drop for ${enrollmentId}`);
    }
    return this.enrollmentRepo.save(enrollment);
  }

  async adminDrop(enrollmentId: string, reason: string, adminId: string) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { id: enrollmentId },
    });
    if (!enrollment) throw new NotFoundException();
    enrollment.status = 'DROPPED';
    enrollment.dropReason = reason;
    enrollment.droppedAt = new Date();
    await this.enrollmentRepo.save(enrollment);
    console.log(`Audit: Admin ${adminId} directly dropped ${enrollmentId}`);
    return enrollment;
  }

  async findEnrollments(currentUser: any) {
    if (currentUser.role === 'ADMIN') return this.enrollmentRepo.find();
    if (currentUser.role === 'STUDENT')
      return this.enrollmentRepo.find({ where: { studentId: currentUser.id } });
    return [];
  }
}
