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
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';

@Controller('marks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarksController {
  constructor(private readonly marksService: MarksService) {}

  @Get('gradebook')
  getGradebook(@Query('courseId') courseId: string, @Req() req: any) {
    return this.marksService.getGradebook(courseId, req.user);
  }

  @Post()
  enterMark(@Body() dto: CreateMarkDto, @Req() req: any) {
    return this.marksService.enterMark(dto, req.user.id);
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
  @Roles(Role.ADMIN)
  createGradingCriteria(@Body() dto: GradingCriteriaDto) {
    return this.marksService.createGradingCriteria(dto);
  }
}
