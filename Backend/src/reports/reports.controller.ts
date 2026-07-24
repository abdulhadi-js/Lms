import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('performance')
  getPerformanceReport(
    @Query('courseId') courseId: string,
    @Query('studentId') studentId: string
  ) {
    return this.reportsService.getPerformanceReport(courseId, studentId);
  }

  @Get('attendance')
  getAttendanceReport(
    @Query('courseId') courseId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportsService.getAttendanceReport(courseId, startDate, endDate);
  }

  @Get('at-risk')
  getAtRiskStudents(@Query('threshold') threshold: number) {
    return this.reportsService.getAtRiskStudents(threshold);
  }

  @Get('overview')
  getOverview() {
    return this.reportsService.getOverview();
  }

  @Get('courses/:id')
  getCourseAnalytics(@Param('id') id: string) {
    return this.reportsService.getCourseAnalytics(id);
  }
}
