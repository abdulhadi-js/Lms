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
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';

@Controller('timetable')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.timetableService.findAll(req.user);
  }

  @Post()
  @RequirePermission(ModuleId.ACADEMICS, 'ADD')
  create(@Body() dto: CreateTimetableDto, @Req() req: any) {
    return this.timetableService.create(dto, req.user);
  }

  @Patch(':id')
  @RequirePermission(ModuleId.ACADEMICS, 'EDIT')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateTimetableDto>,
    @Req() req: any,
  ) {
    return this.timetableService.update(id, dto, req.user);
  }

  @Delete(':id')
  @RequirePermission(ModuleId.ACADEMICS, 'DELETE')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.timetableService.remove(id, req.user);
  }
}
