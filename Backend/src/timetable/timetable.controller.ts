import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';

@Controller('timetable')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.timetableService.findAll(req.user);
  }

  @Post()
  create(@Body() dto: CreateTimetableDto) {
    return this.timetableService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateTimetableDto>) {
    return this.timetableService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timetableService.remove(id);
  }
}
