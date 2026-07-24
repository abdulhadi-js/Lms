import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance) private attendanceRepo: Repository<Attendance>,
  ) {}

  async markAttendance(dto: MarkAttendanceDto, teacherId: string) {
    // In real app, verify teacherId teaches dto.courseId
    const records = [];
    for (const student of dto.students) {
      let record = await this.attendanceRepo.findOne({
        where: { courseId: dto.courseId, studentId: student.studentId, classDate: dto.classDate }
      });
      if (!record) {
        record = this.attendanceRepo.create({
          courseId: dto.courseId,
          studentId: student.studentId,
          classDate: dto.classDate,
        });
      }
      record.status = student.status;
      record.notes = student.notes ?? null as any;
      records.push(record);
    }
    return this.attendanceRepo.save(records);
  }

  async getAttendance(courseId: string, studentId: string, startDate: string, endDate: string, currentUser: any) {
    if (currentUser.role === 'STUDENT' && currentUser.userId !== studentId) {
      throw new ForbiddenException('Can only view own attendance');
    }
    
    const query = this.attendanceRepo.createQueryBuilder('att');
    if (courseId) query.andWhere('att.courseId = :courseId', { courseId });
    if (studentId) query.andWhere('att.studentId = :studentId', { studentId });
    if (startDate) query.andWhere('att.classDate >= :startDate', { startDate });
    if (endDate) query.andWhere('att.classDate <= :endDate', { endDate });
    
    return query.getMany();
  }

  async getAttendanceSummary(courseId: string, studentId?: string) {
    const query = this.attendanceRepo.createQueryBuilder('att')
      .select('att.studentId', 'studentId')
      .addSelect('COUNT(att.id)', 'totalClasses')
      .addSelect(`SUM(CASE WHEN att.status = '${AttendanceStatus.PRESENT}' THEN 1 ELSE 0 END)`, 'presentCount')
      .addSelect(`SUM(CASE WHEN att.status = '${AttendanceStatus.ABSENT}' THEN 1 ELSE 0 END)`, 'absentCount')
      .addSelect(`SUM(CASE WHEN att.status = '${AttendanceStatus.LATE}' THEN 1 ELSE 0 END)`, 'lateCount')
      .where('att.courseId = :courseId', { courseId });
      
    if (studentId) query.andWhere('att.studentId = :studentId', { studentId });
    
    query.groupBy('att.studentId');
    const rawResults = await query.getRawMany();
    
    return rawResults.map(r => ({
      studentId: r.studentId,
      totalClasses: Number(r.totalClasses),
      presentPercent: (Number(r.presentCount) / Number(r.totalClasses)) * 100,
      absentPercent: (Number(r.absentCount) / Number(r.totalClasses)) * 100,
      latePercent: (Number(r.lateCount) / Number(r.totalClasses)) * 100,
    }));
  }

  async updateAttendance(id: string, updateData: Partial<Attendance>) {
    const record = await this.attendanceRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Attendance record not found');
    Object.assign(record, updateData);
    return this.attendanceRepo.save(record);
  }
}
