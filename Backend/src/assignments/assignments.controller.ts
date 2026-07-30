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
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';

@Controller()
@UseGuards(JwtAuthGuard, MatrixGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('assignments/query')
  findAll(
    @Query('sectionId') sectionId: string,
    @Query('subjectId') subjectId: string,
    @Request() req: any
  ) {
    return this.assignmentsService.findAll(sectionId, subjectId, req.user);
  }

  @Get('assignments')
  findAllGlobal(@Request() req: any) {
    return this.assignmentsService.findAllGlobal(req.user);
  }

  @Post('assignments')
  @RequirePermission(ModuleId.EXAMS, 'ADD')
  create(
    @Body() dto: CreateAssignmentDto,
    @Request() req: any,
  ) {
    if (!req.user?.permissions?.includes('MANAGE_ASSIGNMENTS') && !req.user?.isSuperAdmin)
      throw new ForbiddenException();
    return this.assignmentsService.create(dto, req.user);
  }

  @Get('assignments/:id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.assignmentsService.findOne(id, req.user);
  }

  @Patch('assignments/:id')
  @RequirePermission(ModuleId.EXAMS, 'EDIT')
  update(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    if (!req.user?.permissions?.includes('MANAGE_ASSIGNMENTS') && !req.user?.isSuperAdmin)
      throw new ForbiddenException();
    return this.assignmentsService.update(id, dto, req.user);
  }

  @Delete('assignments/:id')
  @RequirePermission(ModuleId.EXAMS, 'DELETE')
  remove(@Param('id') id: string, @Request() req: any) {
    if (!req.user?.permissions?.includes('MANAGE_ASSIGNMENTS') && !req.user?.isSuperAdmin)
      throw new ForbiddenException();
    return this.assignmentsService.remove(id, req.user);
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
      req.user,
      dto,
      file,
    );
  }

  @Get('assignments/:id/submissions')
  getSubmissions(@Param('id') id: string, @Request() req: any) {
    return this.assignmentsService.getSubmissions(id, req.user);
  }

  @Patch('submissions/:id/grade')
  @RequirePermission(ModuleId.EXAMS, 'EDIT')
  gradeSubmission(
    @Param('id') id: string,
    @Body() dto: GradeSubmissionDto,
    @Request() req: any,
  ) {
    if (!req.user?.permissions?.includes('MANAGE_ASSIGNMENTS') && !req.user?.isSuperAdmin)
      throw new ForbiddenException();
    return this.assignmentsService.gradeSubmission(id, dto, req.user);
  }
}
