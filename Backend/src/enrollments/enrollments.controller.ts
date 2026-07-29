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
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { RequestDropDto } from './dto/request-drop.dto';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  directEnroll(@Body() dto: CreateEnrollmentDto, @Request() req: any) {
    if (!req.user?.permissions?.includes('MANAGE_ENROLLMENTS') && !req.user?.isSuperAdmin) throw new ForbiddenException();
    return this.enrollmentsService.directEnroll(dto, req.user);
  }

  @Get()
  findEnrollments(@Request() req: any) {
    return this.enrollmentsService.findEnrollments(req.user);
  }

  @Post('drop')
  requestDrop(
    @Body() dto: RequestDropDto,
    @Request() req: any,
  ) {
    if (req.user?.permissions?.includes('MANAGE_ENROLLMENTS') || req.user?.isSuperAdmin) {
      return this.enrollmentsService.adminDrop(dto.enrollmentId, dto.reason, req.user);
    }
    return this.enrollmentsService.requestDrop(req.user, dto);
  }

  @Patch(':id/drop/review')
  reviewDropRequest(
    @Param('id') id: string,
    @Body('approved') approved: boolean,
    @Request() req: any,
  ) {
    if (!req.user?.permissions?.includes('MANAGE_ENROLLMENTS') && !req.user?.isSuperAdmin) throw new ForbiddenException();
    return this.enrollmentsService.reviewDropRequest(id, approved, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    if (!req.user?.permissions?.includes('MANAGE_ENROLLMENTS') && !req.user?.isSuperAdmin) throw new ForbiddenException();
    return this.enrollmentsService.remove(id, req.user);
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  getApplications(@Query('status') status: string, @Request() req: any) {
    if (!req.user?.permissions?.includes('MANAGE_ENROLLMENTS') && !req.user?.isSuperAdmin) throw new ForbiddenException();
    return this.enrollmentsService.getApplications(status, req.user);
  }

  @Patch(':id/review')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  reviewApplication(
    @Param('id') id: string,
    @Body() dto: ReviewApplicationDto,
    @Request() req: any,
  ) {
    if (!req.user?.permissions?.includes('MANAGE_ENROLLMENTS') && !req.user?.isSuperAdmin) throw new ForbiddenException();
    return this.enrollmentsService.reviewApplication(id, dto, req.user);
  }
}
