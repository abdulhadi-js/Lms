import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, MatrixGuard)
@RequirePermission(ModuleId.REPORTS, 'VIEW')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('performance')
  getPerformanceReport(
    @Query('courseId') courseId: string,
    @Query('studentId') studentId: string,
  ) {
    return this.reportsService.getPerformanceReport(courseId, studentId);
  }

  @Get('attendance')
  getAttendanceReport(
    @Query('courseId') courseId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getAttendanceReport(
      courseId,
      startDate,
      endDate,
    );
  }

  @Get('at-risk')
  getAtRiskStudents(@Query('threshold') threshold: number) {
    return this.reportsService.getAtRiskStudents(threshold);
  }

  @Get('overview')
  getOverview() {
    return this.reportsService.getOverview();
  }

  @Get('sections/:id')
  getSectionAnalytics(@Param('id') id: string) {
    return this.reportsService.getSectionAnalytics(id);
  }
}
