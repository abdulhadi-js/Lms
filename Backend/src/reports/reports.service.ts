import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Mark } from '../marks/entities/mark.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Fee } from '../fees/entities/fee.entity';

@Injectable()
export class ReportsService {
  constructor(private dataSource: DataSource) {}

  async getPerformanceReport(sectionId?: string, studentId?: string) {
    const query = this.dataSource
      .getRepository(Mark)
      .createQueryBuilder('mark')
      .select('mark.sectionId', 'sectionId')
      .addSelect('AVG(mark.score / mark.maxScore * 100)', 'averagePercentage')
      .addSelect('COUNT(mark.id)', 'totalMarks');

    if (sectionId) query.andWhere('mark.sectionId = :sectionId', { sectionId });
    if (studentId) query.andWhere('mark.studentId = :studentId', { studentId });

    query.groupBy('mark.sectionId');
    return query.getRawMany();
  }

  async getAttendanceReport(
    sectionId?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const query = this.dataSource
      .getRepository(Attendance)
      .createQueryBuilder('att')
      .select('att.sectionId', 'sectionId')
      .addSelect('COUNT(att.id)', 'totalClasses')
      .addSelect(
        `SUM(CASE WHEN att.status = 'PRESENT' THEN 1 ELSE 0 END)`,
        'presentCount',
      );

    if (sectionId) query.andWhere('att.sectionId = :sectionId', { sectionId });
    if (startDate) query.andWhere('att.classDate >= :startDate', { startDate });
    if (endDate) query.andWhere('att.classDate <= :endDate', { endDate });

    query.groupBy('att.sectionId');
    const results = await query.getRawMany();
    return results.map((r) => ({
      sectionId: r.sectionId,
      totalClasses: Number(r.totalClasses) || 0,
      totalPresent: Number(r.presentCount) || 0,
      totalAbsent: (Number(r.totalClasses) || 0) - (Number(r.presentCount) || 0),
      attendancePercentage: Number(r.totalClasses) ? (Number(r.presentCount) / Number(r.totalClasses)) * 100 : 0,
    }));
  }

  async getAtRiskStudents(threshold: number = 70) {
    const marksQuery = await this.dataSource
      .getRepository(Mark)
      .createQueryBuilder('mark')
      .select('mark.studentId', 'studentId')
      .addSelect('AVG(mark.score / mark.maxScore * 100)', 'avgMark')
      .groupBy('mark.studentId')
      .having('AVG(mark.score / mark.maxScore * 100) < 50')
      .getRawMany();

    const attendanceQuery = await this.dataSource
      .getRepository(Attendance)
      .createQueryBuilder('att')
      .select('att.studentId', 'studentId')
      .addSelect('COUNT(att.id)', 'totalClasses')
      .addSelect(
        `SUM(CASE WHEN att.status = 'PRESENT' THEN 1 ELSE 0 END)`,
        'presentCount',
      )
      .groupBy('att.studentId')
      .getRawMany();

    const lowAttendance = attendanceQuery.filter(
      (r) =>
        (Number(r.presentCount) / Number(r.totalClasses)) * 100 < threshold,
    );

    const riskStudents = new Map();
    marksQuery.forEach((m) =>
      riskStudents.set(m.studentId, {
        studentId: m.studentId,
        avgMark: m.avgMark,
        riskReason: 'Low Marks',
      }),
    );
    lowAttendance.forEach((a) => {
      const existing = riskStudents.get(a.studentId);
      if (existing) {
        existing.riskReason = 'Low Marks & Low Attendance';
      } else {
        riskStudents.set(a.studentId, {
          studentId: a.studentId,
          avgAttendance:
            (Number(a.presentCount) / Number(a.totalClasses)) * 100,
          riskReason: 'Low Attendance',
        });
      }
    });
    return Array.from(riskStudents.values());
  }

  async getOverview() {
    const totalFeesCollected = await this.dataSource
      .getRepository(Fee)
      .createQueryBuilder('fee')
      .select('SUM(fee.paidAmount)', 'total')
      .getRawOne();

    const pendingFees = await this.dataSource
      .getRepository(Fee)
      .createQueryBuilder('fee')
      .where('fee.status != :status', { status: 'PAID' })
      .select('SUM(fee.amount - fee.paidAmount)', 'total')
      .getRawOne();

    const totalStudents = await this.dataSource
      .getRepository('User')
      .count({ where: { role: 'STUDENT' } });
    const totalTeachers = await this.dataSource
      .getRepository('User')
      .count({ where: { role: 'TEACHER' } });
    const totalClasses = await this.dataSource.getRepository('AcademicClass').count();
    const totalSections = await this.dataSource.getRepository('Section').count();
    const totalEnrollments = await this.dataSource
      .getRepository('Enrollment')
      .count();
    const pendingApplications = await this.dataSource
      .getRepository('Application')
      .count({ where: { status: 'PENDING' } });

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSections,
      totalEnrollments,
      pendingApplications,
      totalFeesCollected: Number(totalFeesCollected.total) || 0,
      totalFeesPending: Number(pendingFees.total) || 0,
    };
  }

  async getSectionAnalytics(sectionId: string) {
    const performance = await this.getPerformanceReport(sectionId);
    const attendance = await this.getAttendanceReport(sectionId);
    return {
      sectionId,
      performance: performance[0] || null,
      attendance: attendance[0] || null,
    };
  }
}
