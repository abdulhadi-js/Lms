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

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
  ) {}

  async create(dto: CreateAssignmentDto, teacherId: string) {
    const assignment = this.assignmentRepo.create(dto);
    return this.assignmentRepo.save(assignment);
  }

  async findAll(courseId: string, currentUser: any) {
    return this.assignmentRepo.find({ where: { courseId } });
  }

  async findOne(id: string) {
    const assignment = await this.assignmentRepo.findOne({ where: { id } });
    if (!assignment) throw new NotFoundException();
    const submissionsCount = await this.submissionRepo.count({
      where: { assignmentId: id },
    });
    return { ...assignment, submissionsCount };
  }

  async update(id: string, dto: any, currentUser: any) {
    const assignment = await this.assignmentRepo.findOne({ where: { id } });
    if (!assignment) throw new NotFoundException();
    Object.assign(assignment, dto);
    return this.assignmentRepo.save(assignment);
  }

  async remove(id: string) {
    const assignment = await this.assignmentRepo.findOne({ where: { id } });
    if (!assignment) throw new NotFoundException();
    return this.assignmentRepo.remove(assignment);
  }

  async submitAssignment(
    assignmentId: string,
    studentId: string,
    dto: SubmitAssignmentDto,
    file?: any,
  ) {
    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId },
    });
    if (!assignment) throw new NotFoundException();
    if (new Date() > assignment.dueDate)
      throw new BadRequestException('Past due date');

    let submission = await this.submissionRepo.findOne({
      where: { assignmentId, studentId },
    });
    if (!submission) {
      submission = this.submissionRepo.create({ assignmentId, studentId });
    }
    submission.textContent = dto.textContent ?? (null as any);
    if (file) submission.fileUrl = file.path;

    return this.submissionRepo.save(submission);
  }

  async getSubmissions(assignmentId: string, currentUser: any) {
    if (currentUser.role === 'STUDENT') {
      return this.submissionRepo.find({
        where: { assignmentId, studentId: currentUser.id },
      });
    }
    return this.submissionRepo.find({ where: { assignmentId } });
  }

  async gradeSubmission(
    submissionId: string,
    dto: GradeSubmissionDto,
    graderId: string,
  ) {
    const submission = await this.submissionRepo.findOne({
      where: { id: submissionId },
    });
    if (!submission) throw new NotFoundException();
    submission.grade = dto.grade;
    submission.feedback = dto.feedback;
    submission.graderId = graderId;
    return this.submissionRepo.save(submission);
  }
}
