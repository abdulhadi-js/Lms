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
import { RolesGuard } from '../common/guards/roles.guard';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { RequestDropDto } from './dto/request-drop.dto';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  directEnroll(@Body() dto: CreateEnrollmentDto, @Request() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.enrollmentsService.directEnroll(dto);
  }

  @Get()
  findEnrollments(@Request() req: any) {
    return this.enrollmentsService.findEnrollments(req.user);
  }

  @Post(':id/drop')
  requestDrop(
    @Param('id') id: string,
    @Body() dto: RequestDropDto,
    @Request() req: any,
  ) {
    if (req.user?.role === 'ADMIN') {
      return this.enrollmentsService.adminDrop(id, dto.reason, req.user.id);
    }
    return this.enrollmentsService.requestDrop(req.user?.id, id, dto);
  }

  @Patch(':id/drop/review')
  reviewDropRequest(
    @Param('id') id: string,
    @Body('approved') approved: boolean,
    @Request() req: any,
  ) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.enrollmentsService.reviewDropRequest(id, approved, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any, @Request() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.enrollmentsService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.enrollmentsService.remove(id);
  }
}
@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  apply(@Body() dto: CreateApplicationDto) {
    return this.enrollmentsService.applyForCourse(dto);
  }

  @Get()
  getApplications(@Query('status') status: string, @Request() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.enrollmentsService.getApplications(status);
  }

  @Patch(':id/review')
  reviewApplication(
    @Param('id') id: string,
    @Body() dto: ReviewApplicationDto,
    @Request() req: any,
  ) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.enrollmentsService.reviewApplication(id, dto, req.user.id);
  }
}
