import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { Submission } from './entities/submission.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { CloudinaryService } from '../config/cloudinary.service';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateAssignmentDto, currentUser: any) {
    const assignment = this.assignmentRepo.create({
      ...dto,
      campusId: currentUser.campusId,
    });
    return this.assignmentRepo.save(assignment);
  }

  async findAll(courseId: string, currentUser: any) {
    const whereClause: any = {};
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    if (courseId) whereClause.courseId = courseId;
    return this.assignmentRepo.find({
      where: whereClause,
      order: { dueDate: 'ASC' },
    });
  }

  async findAllGlobal(currentUser: any) {
    if (
      !currentUser ||
      currentUser.isSuperAdmin ||
      currentUser.permissions?.includes('VIEW_ASSIGNMENTS')
    ) {
      const whereClause: any = {};
      if (currentUser && !currentUser.isSuperAdmin)
        whereClause.campusId = currentUser.campusId;
      return this.assignmentRepo.find({
        where: whereClause,
        order: { dueDate: 'ASC' },
      });
    }
    if (
      currentUser.matrix?.some((m: any) => m.moduleId === 'EXAMS' && m.canEdit)
    ) {
      return this.assignmentRepo
        .createQueryBuilder('a')
        .innerJoin(
          'courses',
          'c',
          'c.id = a.courseId AND c.teacherId = :tid',
          { tid: currentUser.id },
        )
        .orderBy('a.dueDate', 'ASC')
        .getMany();
    }
    // Assume student
    return this.assignmentRepo
      .createQueryBuilder('a')
      .innerJoin(
        'enrollments',
        'e',
        'e.courseId = a.courseId AND e.studentId = :sid AND e.status = :status',
        {
          sid: currentUser.id,
          status: 'ACTIVE',
        },
      )
      .orderBy('a.dueDate', 'ASC')
      .getMany();
  }

  async findOne(id: string, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const assignment = await this.assignmentRepo.findOne({
      where: whereClause,
    });
    if (!assignment) throw new NotFoundException();
    const submissionsCount = await this.submissionRepo.count({
      where: { assignmentId: id },
    });
    return { ...assignment, submissionsCount };
  }

  async update(id: string, dto: any, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const assignment = await this.assignmentRepo.findOne({
      where: whereClause,
    });
    if (!assignment) throw new NotFoundException();
    Object.assign(assignment, dto);
    return this.assignmentRepo.save(assignment);
  }

  async remove(id: string, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const assignment = await this.assignmentRepo.findOne({
      where: whereClause,
    });
    if (!assignment) throw new NotFoundException();
    return this.assignmentRepo.remove(assignment);
  }

  async submitAssignment(
    assignmentId: string,
    currentUser: any,
    dto: SubmitAssignmentDto,
    file?: any,
  ) {
    const whereClause: any = { id: assignmentId };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const assignment = await this.assignmentRepo.findOne({
      where: whereClause,
    });
    if (!assignment) throw new NotFoundException();
    if (new Date() > assignment.dueDate)
      throw new BadRequestException('Past due date');

    let submission = await this.submissionRepo.findOne({
      where: { assignmentId, studentId: currentUser.id },
    });
    if (!submission) {
      submission = this.submissionRepo.create({
        assignmentId,
        studentId: currentUser.id,
        campusId: currentUser.campusId,
      });
    }
    submission.textContent = dto.textContent ?? (null as any);

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(
        file,
        'assignments',
      );
      submission.fileUrl = uploadResult.secureUrl;
    }

    return this.submissionRepo.save(submission);
  }

  async getSubmissions(assignmentId: string, currentUser: any) {
    if (
      !currentUser.matrix?.some(
        (m: any) => m.moduleId === 'EXAMS' && m.canEdit,
      ) &&
      !currentUser.isSuperAdmin
    ) {
      return this.submissionRepo.find({
        where: { assignmentId, studentId: currentUser.id },
      });
    }
    const whereClause: any = { assignmentId };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    return this.submissionRepo.find({ where: whereClause });
  }

  async gradeSubmission(
    submissionId: string,
    dto: GradeSubmissionDto,
    currentUser: any,
  ) {
    const whereClause: any = { id: submissionId };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const submission = await this.submissionRepo.findOne({
      where: whereClause,
    });
    if (!submission) throw new NotFoundException();
    submission.grade = dto.grade;
    submission.feedback = dto.feedback;
    submission.graderId = currentUser.id;
    return this.submissionRepo.save(submission);
  }
}
