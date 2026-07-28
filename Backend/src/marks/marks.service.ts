import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mark } from './entities/mark.entity';
import { GradingCriteria } from './entities/grading-criteria.entity';
import { CreateMarkDto } from './dto/create-mark.dto';
import { UpdateMarkDto } from './dto/update-mark.dto';
import { GradingCriteriaDto } from './dto/grading-criteria.dto';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import type { Response } from 'express';
const PDFDocument = require('pdfkit');
@Injectable()
export class MarksService {
  constructor(
    @InjectRepository(Mark)
    private markRepo: Repository<Mark>,
    @InjectRepository(GradingCriteria)
    private criteriaRepo: Repository<GradingCriteria>,
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService,
  ) {}

  async calculateGrade(
    score: number,
    maxScore: number,
  ): Promise<{ gradeLetter: string; gpaPoints: number }> {
    const percentage = (score / maxScore) * 100;
    const criteria = await this.criteriaRepo.find();
    const matched = criteria.find(
      (c) => percentage >= c.minScore && percentage <= c.maxScore,
    );
    if (!matched) return { gradeLetter: 'F', gpaPoints: 0.0 };
    return { gradeLetter: matched.gradeLetter, gpaPoints: matched.gpaPoints };
  }

  async enterMark(dto: CreateMarkDto, graderId: string) {
    const { gradeLetter, gpaPoints } = await this.calculateGrade(
      dto.score,
      dto.maxScore,
    );
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
      throw new ForbiddenException(
        'Cannot edit marks you did not enter unless ADMIN',
      );
    }

    if (currentUser.role === 'ADMIN' && dto.overrideReason) {
      mark.overrideReason = dto.overrideReason;
      // In a real app, also write to an AuditLog entity here.
    }

    Object.assign(mark, dto);

    if (dto.score !== undefined || dto.maxScore !== undefined) {
      const { gradeLetter, gpaPoints } = await this.calculateGrade(
        mark.score,
        mark.maxScore,
      );
      mark.gradeLetter = gradeLetter;
      mark.gpaPoints = gpaPoints;
    }

    return this.markRepo.save(mark);
  }

  async getGradebook(courseId: string, currentUser: any) {
    if (currentUser.role === 'STUDENT') {
      return this.markRepo.find({
        where: { courseId, studentId: currentUser.userId },
      });
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

  async generateTranscriptPdf(studentId: string, currentUser: any, res: Response) {
    if (currentUser.role === 'STUDENT' && currentUser.userId !== studentId) {
      throw new ForbiddenException('Cannot view other student transcripts');
    }

    const student = await this.usersService.findOne(studentId);
    if (!student) throw new NotFoundException('Student not found');

    const marks = await this.markRepo.find({ where: { studentId } });
    const gpa = await this.calculateCumulativeGPA(studentId);

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=transcript-${student.firstName}-${student.lastName}.pdf`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('EduCore LMS', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).font('Helvetica').text('Official Academic Transcript', { align: 'center' });
    doc.moveDown(2);

    // Student Info
    doc.fontSize(12).font('Helvetica-Bold').text('Student Information:');
    doc.font('Helvetica').text(`Name: ${student.firstName} ${student.lastName}`);
    doc.text(`Email: ${student.email}`);
    doc.text(`Student ID: ${student.id}`);
    doc.moveDown();

    doc.font('Helvetica-Bold').text(`Cumulative GPA: ${gpa.toFixed(2)} / 4.00`);
    doc.moveDown(2);

    // Academic Record
    doc.fontSize(16).font('Helvetica-Bold').text('Academic Record', { underline: true });
    doc.moveDown();

    if (marks.length === 0) {
      doc.font('Helvetica').fontSize(12).text('No grades recorded yet.');
    } else {
      // Fetch course names to display nicely
      for (const mark of marks) {
        let courseTitle = 'Unknown Course';
        try {
          const course = await this.coursesService.findOne(mark.courseId);
          if (course) courseTitle = course.title;
        } catch (e) {
          // Ignore
        }
        
        doc.font('Helvetica-Bold').fontSize(12).text(`${courseTitle} (${mark.component})`);
        doc.font('Helvetica').fontSize(11).text(`Score: ${mark.score} / ${mark.maxScore} (Weight: ${mark.weightPercent}%)`);
        doc.text(`Grade: ${mark.gradeLetter || 'N/A'} (Points: ${mark.gpaPoints || 0})`);
        if (mark.overrideReason) {
          doc.fillColor('red').text(`* Grade Overridden: ${mark.overrideReason}`).fillColor('black');
        }
        doc.moveDown(1);
      }
    }

    doc.end();
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
    const totalGPA = marks.reduce(
      (sum, mark) => sum + (mark.gpaPoints || 0),
      0,
    );
    return totalGPA / marks.length;
  }
}
