import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { MarksService } from './marks.service';
import { CreateMarkDto } from './dto/create-mark.dto';
import { UpdateMarkDto } from './dto/update-mark.dto';
import { GradingCriteriaDto } from './dto/grading-criteria.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';

@Controller('marks')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class MarksController {
  constructor(private readonly marksService: MarksService) {}

  @Get()
  getMarks(@Query('studentId') studentId: string, @Query('sectionId') sectionId: string, @Query('subjectId') subjectId: string, @Req() req: any) {
    if (studentId) {
      return this.marksService.getTranscript(studentId, req.user);
    }
    return this.marksService.getGradebook(sectionId, subjectId, req.user);
  }

  @Get('gradebook')
  getGradebook(@Query('sectionId') sectionId: string, @Query('subjectId') subjectId: string, @Req() req: any) {
    return this.marksService.getGradebook(sectionId, subjectId, req.user);
  }

  @Post()
  enterMark(@Body() dto: CreateMarkDto, @Req() req: any) {
    return this.marksService.enterMark(dto, req.user);
  }

  @Patch(':id')
  updateMark(
    @Param('id') id: string,
    @Body() dto: UpdateMarkDto,
    @Req() req: any,
  ) {
    return this.marksService.updateMark(id, dto, req.user);
  }

  @Get('transcript/:studentId')
  getTranscript(@Param('studentId') studentId: string, @Req() req: any) {
    return this.marksService.getTranscript(studentId, req.user);
  }

  @Get('transcript/:studentId/pdf')
  async getTranscriptPdf(
    @Param('studentId') studentId: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    return this.marksService.generateTranscriptPdf(studentId, req.user, res);
  }

  @Get('grading-criteria')
  getGradingCriteria() {
    return this.marksService.getGradingCriteria();
  }

  @Post('grading-criteria')
  @RequirePermission(ModuleId.EXAMS, 'ADD')
  createGradingCriteria(@Body() dto: GradingCriteriaDto) {
    return this.marksService.createGradingCriteria(dto);
  }
}
