import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('courses/:courseId/assignments')
  findAll(@Param('courseId') courseId: string, @Request() req: any) {
    return this.assignmentsService.findAll(courseId, req.user);
  }

  @Post('courses/:courseId/assignments')
  create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateAssignmentDto,
    @Request() req: any,
  ) {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'TEACHER')
      throw new ForbiddenException();
    dto.courseId = courseId;
    return this.assignmentsService.create(dto, req.user.id);
  }

  @Get('assignments/:id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch('assignments/:id')
  update(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'TEACHER')
      throw new ForbiddenException();
    return this.assignmentsService.update(id, dto, req.user);
  }

  @Delete('assignments/:id')
  remove(@Param('id') id: string, @Request() req: any) {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'TEACHER')
      throw new ForbiddenException();
    return this.assignmentsService.remove(id);
  }

  @Post('assignments/:id/submissions')
  @UseInterceptors(FileInterceptor('file'))
  submitAssignment(
    @Param('id') id: string,
    @Body() dto: SubmitAssignmentDto,
    @UploadedFile() file: any,
    @Request() req: any,
  ) {
    return this.assignmentsService.submitAssignment(
      id,
      req.user?.id,
      dto,
      file,
    );
  }

  @Get('assignments/:id/submissions')
  getSubmissions(@Param('id') id: string, @Request() req: any) {
    return this.assignmentsService.getSubmissions(id, req.user);
  }

  @Patch('submissions/:id/grade')
  gradeSubmission(
    @Param('id') id: string,
    @Body() dto: GradeSubmissionDto,
    @Request() req: any,
  ) {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'TEACHER')
      throw new ForbiddenException();
    return this.assignmentsService.gradeSubmission(id, dto, req.user?.id);
  }
}
