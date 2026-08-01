import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

import { User } from '../users/entities/user.entity';
import { MessagingService } from '../messaging/messaging.service';
import { MessageStatus } from '../messaging/entities/message-outbox.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private messagingService: MessagingService,
  ) {}

  async markAttendance(dto: MarkAttendanceDto, currentUser: any) {
    const records = [];
    for (const student of dto.students) {
      let record = await this.attendanceRepo.findOne({
        where: {
          sectionId: dto.sectionId,
          subjectId: dto.subjectId,
          studentId: student.studentId,
          classDate: dto.classDate,
          campusId: currentUser.isSuperAdmin ? undefined : currentUser.campusId,
        },
      });
      if (!record) {
        record = this.attendanceRepo.create({
          sectionId: dto.sectionId,
          subjectId: dto.subjectId,
          studentId: student.studentId,
          classDate: dto.classDate,
          campusId: currentUser.campusId,
        });
      }
      record.status = student.status;
      record.notes = student.notes ?? (null as any);
      records.push(record);

      if (student.status === AttendanceStatus.ABSENT) {
        const studentUser = await this.userRepo.findOne({
          where: { id: student.studentId },
        });
        if (studentUser && studentUser.phone) {
          await this.messagingService.queueMessage({
            recipientPhone: studentUser.phone,
            content: `Notice: ${studentUser.firstName} ${studentUser.lastName} was marked ABSENT on ${dto.classDate}.`,
            status: MessageStatus.PENDING,
          });
        }
      }
    }
    return this.attendanceRepo.save(records);
  }

  async getAttendance(
    sectionId: string,
    subjectId: string,
    studentId: string,
    startDate: string,
    endDate: string,
    currentUser: any,
  ) {
    if (currentUser.role === 'STUDENT' && currentUser.id !== studentId) {
      throw new ForbiddenException('Can only view own attendance');
    }

    const query = this.attendanceRepo.createQueryBuilder('att');
    if (!currentUser.isSuperAdmin)
      query.andWhere('att.campusId = :campusId', {
        campusId: currentUser.campusId,
      });
    if (sectionId) query.andWhere('att.sectionId = :sectionId', { sectionId });
    if (subjectId) query.andWhere('att.subjectId = :subjectId', { subjectId });
    if (studentId) query.andWhere('att.studentId = :studentId', { studentId });
    if (startDate) query.andWhere('att.classDate >= :startDate', { startDate });
    if (endDate) query.andWhere('att.classDate <= :endDate', { endDate });

    return query.getMany();
  }

  async getAttendanceSummary(
    sectionId: string,
    subjectId: string,
    studentId: string | undefined,
    currentUser: any,
  ) {
    const query = this.attendanceRepo
      .createQueryBuilder('att')
      .select('att.studentId', 'studentId')
      .addSelect('COUNT(att.id)', 'totalClasses')
      .addSelect(
        `SUM(CASE WHEN att.status = '${AttendanceStatus.PRESENT}' THEN 1 ELSE 0 END)`,
        'presentCount',
      )
      .addSelect(
        `SUM(CASE WHEN att.status = '${AttendanceStatus.ABSENT}' THEN 1 ELSE 0 END)`,
        'absentCount',
      )
      .addSelect(
        `SUM(CASE WHEN att.status = '${AttendanceStatus.LATE}' THEN 1 ELSE 0 END)`,
        'lateCount',
      )
      .where('att.sectionId = :sectionId', { sectionId });

    if (!currentUser.isSuperAdmin) {
      query.andWhere('att.campusId = :campusId', {
        campusId: currentUser.campusId,
      });
    }

    if (subjectId) {
      query.andWhere('att.subjectId = :subjectId', { subjectId });
    }

    if (studentId) query.andWhere('att.studentId = :studentId', { studentId });

    query.groupBy('att.studentId');
    const rawResults = await query.getRawMany();

    return rawResults.map((r) => ({
      studentId: r.studentId,
      totalClasses: Number(r.totalClasses),
      presentPercent: (Number(r.presentCount) / Number(r.totalClasses)) * 100,
      absentPercent: (Number(r.absentCount) / Number(r.totalClasses)) * 100,
      latePercent: (Number(r.lateCount) / Number(r.totalClasses)) * 100,
    }));
  }

  async updateAttendance(
    id: string,
    updateData: Partial<Attendance>,
    currentUser: any,
  ) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const record = await this.attendanceRepo.findOne({ where: whereClause });
    if (!record) throw new NotFoundException('Attendance record not found');
    Object.assign(record, updateData);
    return this.attendanceRepo.save(record);
  }

  async bulkMarkAttendance(
    dto: {
      courseId: string;
      grNumbers: string[];
      status: AttendanceStatus;
      date: string;
    },
    currentUser: any,
  ) {
    // Determine the user field used for "grNumbers". The requirement mentions user.id or user.familyCode.
    // Assuming they are user ids for now since it's the safest unique identifier.
    const records = [];
    for (const grNumber of dto.grNumbers) {
      const user = await this.userRepo.findOne({ where: { id: grNumber } });
      if (user) {
        let record = await this.attendanceRepo.findOne({
          where: {
            courseId: dto.courseId,
            studentId: user.id,
            classDate: dto.date,
          },
        });
        if (!record) {
          record = this.attendanceRepo.create({
            courseId: dto.courseId,
            studentId: user.id,
            userId: user.id,
            classDate: dto.date,
            campusId: currentUser.campusId,
          });
        }
        record.status = dto.status;
        records.push(record);
      }
    }
    return this.attendanceRepo.save(records);
  }

  async markBiometric(
    dto: { userId: string; timestamp: string },
    currentUser: any,
  ) {
    const dateStr = new Date(dto.timestamp).toISOString().split('T')[0];
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    let record = await this.attendanceRepo.findOne({
      where: {
        userId: dto.userId,
        classDate: dateStr,
      },
    });

    if (!record) {
      record = this.attendanceRepo.create({
        userId: dto.userId,
        classDate: dateStr,
        status: AttendanceStatus.PRESENT,
        campusId: currentUser.campusId,
      });
    } else {
      record.status = AttendanceStatus.PRESENT;
    }

    return this.attendanceRepo.save(record);
  }
}
