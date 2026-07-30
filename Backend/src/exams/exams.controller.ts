import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';

@Controller('exams')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  // QUESTIONS
  @Get('questions')
  @RequirePermission(ModuleId.ACADEMICS, 'VIEW')
  getQuestions() {
    return this.examsService.getQuestions();
  }

  @Post('questions')
  @RequirePermission(ModuleId.ACADEMICS, 'ADD')
  createQuestion(@Body() dto: any) {
    return this.examsService.createQuestion(dto);
  }

  @Put('questions/:id')
  @RequirePermission(ModuleId.ACADEMICS, 'EDIT')
  updateQuestion(@Param('id') id: string, @Body() dto: any) {
    return this.examsService.updateQuestion(id, dto);
  }

  @Delete('questions/:id')
  @RequirePermission(ModuleId.ACADEMICS, 'DELETE')
  deleteQuestion(@Param('id') id: string) {
    return this.examsService.deleteQuestion(id);
  }

  // EXAMS
  @Get()
  @RequirePermission(ModuleId.ACADEMICS, 'VIEW')
  getExams() {
    return this.examsService.getExams();
  }

  @Get(':id')
  @RequirePermission(ModuleId.ACADEMICS, 'VIEW')
  getExam(@Param('id') id: string) {
    return this.examsService.getExam(id);
  }

  @Post()
  @RequirePermission(ModuleId.ACADEMICS, 'ADD')
  createExam(@Body() dto: any) {
    return this.examsService.createExam(dto);
  }

  @Put(':id')
  @RequirePermission(ModuleId.ACADEMICS, 'EDIT')
  updateExam(@Param('id') id: string, @Body() dto: any) {
    return this.examsService.updateExam(id, dto);
  }

  @Delete(':id')
  @RequirePermission(ModuleId.ACADEMICS, 'DELETE')
  deleteExam(@Param('id') id: string) {
    return this.examsService.deleteExam(id);
  }

  @Post(':id/questions')
  @RequirePermission(ModuleId.ACADEMICS, 'EDIT')
  assignQuestionsToExam(@Param('id') id: string, @Body() body: { questionIds: string[] }) {
    return this.examsService.assignQuestionsToExam(id, body.questionIds);
  }

  @Post(':id/submit')
  @RequirePermission(ModuleId.ACADEMICS, 'VIEW')
  submitExam(@Param('id') id: string, @Body() body: { answers: Record<string, string> }, @Req() req: any) {
    // Assuming req.user.id is the studentId
    return this.examsService.submitExam(id, req.user.id, body.answers);
  }
}
