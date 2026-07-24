import { Controller, Get, Post, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { AttendanceStatus } from './entities/attendance.entity';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  markAttendance(@Body() dto: MarkAttendanceDto, @Req() req: any) {
    return this.attendanceService.markAttendance(dto, req.user.id);
  }

  @Get()
  getAttendance(
    @Query('courseId') courseId: string,
    @Query('studentId') studentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: any
  ) {
    return this.attendanceService.getAttendance(courseId, studentId, startDate, endDate, req.user);
  }

  @Get('summary')
  getAttendanceSummary(
    @Query('courseId') courseId: string,
    @Query('studentId') studentId: string
  ) {
    return this.attendanceService.getAttendanceSummary(courseId, studentId);
  }

  @Patch(':id')
  updateAttendance(@Param('id') id: string, @Body('status') status: AttendanceStatus) {
    return this.attendanceService.updateAttendance(id, { status });
  }
}
