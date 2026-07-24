import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Mark } from '../marks/entities/mark.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Fee } from '../fees/entities/fee.entity';

@Injectable()
export class ReportsService {
  constructor(private dataSource: DataSource) {}

  async getPerformanceReport(courseId?: string, studentId?: string) {
    const query = this.dataSource
      .getRepository(Mark)
      .createQueryBuilder('mark')
      .select('mark.courseId', 'courseId')
      .addSelect('AVG(mark.score / mark.maxScore * 100)', 'averagePercentage')
      .addSelect('COUNT(mark.id)', 'totalMarks');

    if (courseId) query.andWhere('mark.courseId = :courseId', { courseId });
    if (studentId) query.andWhere('mark.studentId = :studentId', { studentId });

    query.groupBy('mark.courseId');
    return query.getRawMany();
  }

  async getAttendanceReport(
    courseId?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const query = this.dataSource
      .getRepository(Attendance)
      .createQueryBuilder('att')
      .select('att.courseId', 'courseId')
      .addSelect('COUNT(att.id)', 'totalClasses')
      .addSelect(
        `SUM(CASE WHEN att.status = 'PRESENT' THEN 1 ELSE 0 END)`,
        'presentCount',
      );

    if (courseId) query.andWhere('att.courseId = :courseId', { courseId });
    if (startDate) query.andWhere('att.classDate >= :startDate', { startDate });
    if (endDate) query.andWhere('att.classDate <= :endDate', { endDate });

    query.groupBy('att.courseId');
    const results = await query.getRawMany();
    return results.map((r) => ({
      courseId: r.courseId,
      totalClasses: Number(r.totalClasses) || 0,
      totalPresent: Number(r.presentCount) || 0,
      totalAbsent: (Number(r.totalClasses) || 0) - (Number(r.presentCount) || 0),
      attendancePercentage: Number(r.totalClasses) ? (Number(r.presentCount) / Number(r.totalClasses)) * 100 : 0,
    }));
  }

  async getAtRiskStudents(threshold: number = 70) {
    // Finding students with <70% attendance OR avg marks <50
    // As a simplification, we can do this in two queries or using a combined query if we have a student entity.
    // For now, we will fetch average marks and average attendance separately, then merge them.
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

    // Merge results
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
    const totalCourses = await this.dataSource.getRepository('Course').count();
    const totalEnrollments = await this.dataSource
      .getRepository('Enrollment')
      .count();
    const pendingApplications = await this.dataSource
      .getRepository('Application')
      .count({ where: { status: 'PENDING_REVIEW' } });

    return {
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      pendingApplications,
      totalFeesCollected: Number(totalFeesCollected.total) || 0,
      totalFeesPending: Number(pendingFees.total) || 0,
    };
  }

  async getCourseAnalytics(courseId: string) {
    const performance = await this.getPerformanceReport(courseId);
    const attendance = await this.getAttendanceReport(courseId);
    return {
      courseId,
      performance: performance[0] || null,
      attendance: attendance[0] || null,
    };
  }
}
