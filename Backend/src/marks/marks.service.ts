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
import { AcademicsService } from '../academics/academics.service';
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
    private readonly academicsService: AcademicsService,
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

  async enterMark(dto: CreateMarkDto, currentUser: any) {
    const { gradeLetter, gpaPoints } = await this.calculateGrade(
      dto.score,
      dto.maxScore,
    );
    const mark = this.markRepo.create({
      ...dto,
      graderId: currentUser.id,
      gradeLetter,
      gpaPoints,
      campusId: currentUser.campusId,
    });
    return this.markRepo.save(mark);
  }

  async updateMark(id: string, dto: UpdateMarkDto, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const mark = await this.markRepo.findOne({ where: whereClause });
    if (!mark) throw new NotFoundException('Mark not found');

    if (
      !currentUser.matrix?.some(
        (m: any) => m.moduleId === 'EXAMS' && m.canEdit,
      ) &&
      !currentUser.isSuperAdmin &&
      mark.graderId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Cannot edit marks you did not enter unless you have permission',
      );
    }

    if (
      (currentUser.matrix?.some(
        (m: any) => m.moduleId === 'EXAMS' && m.canEdit,
      ) ||
        currentUser.isSuperAdmin) &&
      dto.overrideReason
    ) {
      mark.overrideReason = dto.overrideReason;
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

  async getGradebook(sectionId: string, subjectId: string, currentUser: any) {
    const whereClause: any = { sectionId, subjectId };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;

    if (
      !currentUser.permissions?.includes('VIEW_MARKS') &&
      !currentUser.isSuperAdmin
    ) {
      whereClause.studentId = currentUser.id;
      return this.markRepo.find({ where: whereClause });
    }
    return this.markRepo.find({ where: whereClause });
  }

  async getTranscript(studentId: string, currentUser: any) {
    if (
      !currentUser.permissions?.includes('VIEW_MARKS') &&
      !currentUser.isSuperAdmin &&
      currentUser.id !== studentId
    ) {
      throw new ForbiddenException('Cannot view other student transcripts');
    }
    const whereClause: any = { studentId };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const marks = await this.markRepo.find({ where: whereClause });
    const gpa = await this.calculateCumulativeGPA(studentId, currentUser);

    let totalScore = 0;
    let totalMaxScore = 0;
    marks.forEach(m => {
      totalScore += m.score;
      totalMaxScore += m.maxScore;
    });
    const overallPercentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
    
    let remarks = "Needs Improvement";
    if (overallPercentage >= 90) remarks = "Excellent";
    else if (overallPercentage >= 80) remarks = "Very Good";
    else if (overallPercentage >= 70) remarks = "Good";
    else if (overallPercentage >= 60) remarks = "Fair";

    return { marks, cumulativeGPA: gpa, overallPercentage, remarks };
  }

  async generateTranscriptPdf(
    studentId: string,
    currentUser: any,
    res: Response,
  ) {
    if (
      !currentUser.permissions?.includes('VIEW_MARKS') &&
      !currentUser.isSuperAdmin &&
      currentUser.id !== studentId
    ) {
      throw new ForbiddenException('Cannot view other student transcripts');
    }

    const student = await this.usersService.findOne(studentId, currentUser);
    if (!student) throw new NotFoundException('Student not found');

    const whereClause: any = { studentId };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const marks = await this.markRepo.find({ where: whereClause });
    const gpa = await this.calculateCumulativeGPA(studentId, currentUser);

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=transcript-${student.firstName}-${student.lastName}.pdf`,
    );

    doc.pipe(res);

    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('EduCore LMS', { align: 'center' });
    doc.moveDown(0.5);
    doc
      .fontSize(18)
      .font('Helvetica')
      .text('Official Academic Transcript', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12).font('Helvetica-Bold').text('Student Information:');
    doc
      .font('Helvetica')
      .text(`Name: ${student.firstName} ${student.lastName}`);
    doc.text(`Email: ${student.email}`);
    doc.text(`Student ID: ${student.id}`);
    doc.moveDown();

    doc.font('Helvetica-Bold').text(`Cumulative GPA: ${gpa.toFixed(2)} / 4.00`);
    doc.moveDown(2);

    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Academic Record', { underline: true });
    doc.moveDown();

    if (marks.length === 0) {
      doc.font('Helvetica').fontSize(12).text('No grades recorded yet.');
    } else {
      for (const mark of marks) {
        doc
          .font('Helvetica-Bold')
          .fontSize(12)
          .text(
            `Subject/Section: ${mark.subjectId}/${mark.sectionId} (${mark.component})`,
          );
        doc
          .font('Helvetica')
          .fontSize(11)
          .text(
            `Score: ${mark.score} / ${mark.maxScore} (Weight: ${mark.weightPercent}%)`,
          );
        doc.text(
          `Grade: ${mark.gradeLetter || 'N/A'} (Points: ${mark.gpaPoints || 0})`,
        );
        if (mark.overrideReason) {
          doc
            .fillColor('red')
            .text(`* Grade Overridden: ${mark.overrideReason}`)
            .fillColor('black');
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

  async calculateCumulativeGPA(
    studentId: string,
    currentUser: any,
  ): Promise<number> {
    const whereClause: any = { studentId };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const marks = await this.markRepo.find({ where: whereClause });
    if (marks.length === 0) return 0;
    const totalGPA = marks.reduce(
      (sum, mark) => sum + (mark.gpaPoints || 0),
      0,
    );
    return totalGPA / marks.length;
  }
}
