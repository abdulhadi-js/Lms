import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mark } from './entities/mark.entity';
import { GradingCriteria } from './entities/grading-criteria.entity';
import { CreateMarkDto } from './dto/create-mark.dto';
import { UpdateMarkDto } from './dto/update-mark.dto';
import { GradingCriteriaDto } from './dto/grading-criteria.dto';

@Injectable()
export class MarksService {
  constructor(
    @InjectRepository(Mark) private markRepo: Repository<Mark>,
    @InjectRepository(GradingCriteria) private criteriaRepo: Repository<GradingCriteria>,
  ) {}

  async calculateGrade(score: number, maxScore: number): Promise<{ gradeLetter: string; gpaPoints: number }> {
    const percentage = (score / maxScore) * 100;
    const criteria = await this.criteriaRepo.find();
    const matched = criteria.find(c => percentage >= c.minScore && percentage <= c.maxScore);
    if (!matched) return { gradeLetter: 'F', gpaPoints: 0.0 };
    return { gradeLetter: matched.gradeLetter, gpaPoints: matched.gpaPoints };
  }

  async enterMark(dto: CreateMarkDto, graderId: string) {
    const { gradeLetter, gpaPoints } = await this.calculateGrade(dto.score, dto.maxScore);
    const mark = this.markRepo.create({
      ...dto,
      graderId,
      gradeLetter,
      gpaPoints,
    });
    return this.markRepo.save(mark);
  }

  async updateMark(id: string, dto: UpdateMarkDto, currentUser: any) {
    const mark = await this.markRepo.findOne({ where: { id } });
    if (!mark) throw new NotFoundException('Mark not found');

    if (currentUser.role !== 'ADMIN' && mark.graderId !== currentUser.userId) {
      throw new ForbiddenException('Cannot edit marks you did not enter unless ADMIN');
    }

    if (currentUser.role === 'ADMIN' && dto.overrideReason) {
      mark.overrideReason = dto.overrideReason;
      // In a real app, also write to an AuditLog entity here.
    }

    Object.assign(mark, dto);
    
    if (dto.score !== undefined || dto.maxScore !== undefined) {
      const { gradeLetter, gpaPoints } = await this.calculateGrade(mark.score, mark.maxScore);
      mark.gradeLetter = gradeLetter;
      mark.gpaPoints = gpaPoints;
    }

    return this.markRepo.save(mark);
  }

  async getGradebook(courseId: string, currentUser: any) {
    if (currentUser.role === 'STUDENT') {
      return this.markRepo.find({ where: { courseId, studentId: currentUser.userId } });
    }
    return this.markRepo.find({ where: { courseId } });
  }

  async getTranscript(studentId: string, currentUser: any) {
    if (currentUser.role === 'STUDENT' && currentUser.userId !== studentId) {
      throw new ForbiddenException('Cannot view other student transcripts');
    }
    const marks = await this.markRepo.find({ where: { studentId } });
    const gpa = await this.calculateCumulativeGPA(studentId);
    return { marks, cumulativeGPA: gpa };
  }

  async createGradingCriteria(dto: GradingCriteriaDto) {
    const criteria = this.criteriaRepo.create(dto);
    return this.criteriaRepo.save(criteria);
  }

  async getGradingCriteria() {
    return this.criteriaRepo.find();
  }

  async calculateCumulativeGPA(studentId: string): Promise<number> {
    const marks = await this.markRepo.find({ where: { studentId } });
    if (marks.length === 0) return 0;
    
    // Simplistic calculation: average of all gpaPoints
    const totalGPA = marks.reduce((sum, mark) => sum + (mark.gpaPoints || 0), 0);
    return totalGPA / marks.length;
  }
}
