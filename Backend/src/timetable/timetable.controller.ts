import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';

@Controller('timetable')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.timetableService.findAll(req.user);
  }

  @Post()
  create(@Body() dto: CreateTimetableDto, @Req() req: any) {
    return this.timetableService.create(dto, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateTimetableDto>, @Req() req: any) {
    return this.timetableService.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.timetableService.remove(id, req.user);
  }
}
