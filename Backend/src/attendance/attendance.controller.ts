import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { AttendanceStatus } from './entities/attendance.entity';

@Controller('attendance')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  markAttendance(@Body() dto: MarkAttendanceDto, @Req() req: any) {
    return this.attendanceService.markAttendance(dto, req.user);
  }

  @Post('bulk-mark')
  bulkMarkAttendance(
    @Body()
    dto: {
      courseId: string;
      grNumbers: string[];
      status: AttendanceStatus;
      date: string;
    },
    @Req() req: any,
  ) {
    return this.attendanceService.bulkMarkAttendance(dto, req.user);
  }

  @Post('biometric')
  markBiometric(
    @Body() dto: { userId: string; timestamp: string },
    @Req() req: any,
  ) {
    return this.attendanceService.markBiometric(dto, req.user);
  }

  @Get()
  getAttendance(
    @Query('sectionId') sectionId: string,
    @Query('subjectId') subjectId: string,
    @Query('studentId') studentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: any,
  ) {
    return this.attendanceService.getAttendance(
      sectionId,
      subjectId,
      studentId,
      startDate,
      endDate,
      req.user,
    );
  }

  @Get('summary')
  getAttendanceSummary(
    @Query('sectionId') sectionId: string,
    @Query('subjectId') subjectId: string,
    @Query('studentId') studentId: string,
    @Req() req: any,
  ) {
    return this.attendanceService.getAttendanceSummary(
      sectionId,
      subjectId,
      studentId,
      req.user,
    );
  }

  @Patch(':id')
  updateAttendance(
    @Param('id') id: string,
    @Body('status') status: AttendanceStatus,
    @Req() req: any,
  ) {
    return this.attendanceService.updateAttendance(id, { status }, req.user);
  }
}
