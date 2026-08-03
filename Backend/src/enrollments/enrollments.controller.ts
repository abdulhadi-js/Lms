import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Request,
  ForbiddenException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { RequestDropDto } from './dto/request-drop.dto';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @RequirePermission(ModuleId.ADMISSIONS, 'ADD')
  directEnroll(@Body() dto: any, @Request() req: any) {
    return this.enrollmentsService.directEnroll(dto, req.user);
  }

  @Post('bulk')
  @RequirePermission(ModuleId.ADMISSIONS, 'ADD')
  bulkEnroll(@Body() dto: { courseId?: string; sectionId?: string; studentIds: string[] }, @Request() req: any) {
    return this.enrollmentsService.bulkEnroll(dto, req.user);
  }

  @Get()
  findEnrollments(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Request() req: any
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 0;
    return this.enrollmentsService.findEnrollments(req.user, pageNum, limitNum);
  }

  @Post('drop')
  requestDrop(@Body() dto: RequestDropDto, @Request() req: any) {
    if (
      (req.user?.matrix &&
        req.user.matrix.some(
          (m: any) => m.moduleId === 'ADMISSIONS' && m.canEdit,
        )) ||
      req.user?.isSuperAdmin
    ) {
      return this.enrollmentsService.adminDrop(
        dto.enrollmentId,
        dto.reason,
        req.user,
      );
    }
    return this.enrollmentsService.requestDrop(req.user, dto);
  }

  @Patch(':id/drop/review')
  @RequirePermission(ModuleId.ADMISSIONS, 'EDIT')
  reviewDropRequest(
    @Param('id') id: string,
    @Body('approved') approved: boolean,
    @Request() req: any,
  ) {
    return this.enrollmentsService.reviewDropRequest(id, approved, req.user);
  }

  @Delete(':id')
  @RequirePermission(ModuleId.ADMISSIONS, 'DELETE')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.enrollmentsService.remove(id, req.user);
  }

  @Post('rollover')
  @RequirePermission(ModuleId.ACADEMICS, 'EDIT')
  async rollover(
    @Body()
    body: { fromCourseId: string; toCourseId: string; studentIds?: string[] },
    @Request() req: any,
  ) {
    return this.enrollmentsService.rollover(body, req.user);
  }
}

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  apply(@Body() dto: CreateApplicationDto, @Request() req: any) {
    return this.enrollmentsService.apply(dto, req.user || { campusId: null });
  }

  @Get()
  @UseGuards(JwtAuthGuard, MatrixGuard)
  @RequirePermission(ModuleId.ADMISSIONS, 'VIEW')
  getApplications(@Query('status') status: string, @Request() req: any) {
    return this.enrollmentsService.getApplications(status, req.user);
  }

  @Patch(':id/review')
  @UseGuards(JwtAuthGuard, MatrixGuard)
  @RequirePermission(ModuleId.ADMISSIONS, 'EDIT')
  reviewApplication(
    @Param('id') id: string,
    @Body() dto: ReviewApplicationDto,
    @Request() req: any,
  ) {
    return this.enrollmentsService.reviewApplication(id, dto, req.user);
  }
}
