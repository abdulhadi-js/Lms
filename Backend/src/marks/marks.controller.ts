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
} from '@nestjs/common';
import { MarksService } from './marks.service';
import { CreateMarkDto } from './dto/create-mark.dto';
import { UpdateMarkDto } from './dto/update-mark.dto';
import { GradingCriteriaDto } from './dto/grading-criteria.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

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

  @Get('grading-criteria')
  getGradingCriteria() {
    return this.marksService.getGradingCriteria();
  }

  @Post('grading-criteria')
  createGradingCriteria(@Body() dto: GradingCriteriaDto) {
    // Should be Admin only guard
    return this.marksService.createGradingCriteria(dto);
  }
}
