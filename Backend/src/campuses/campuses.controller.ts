import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CampusesService } from './campuses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';

@Controller('campuses')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class CampusesController {
  constructor(private readonly campusesService: CampusesService) {}

  @Post()
  @RequirePermission(ModuleId.CAMPUSES, 'ADD')
  create(@Body() data: any) {
    return this.campusesService.create(data);
  }

  @Get()
  @RequirePermission(ModuleId.CAMPUSES, 'VIEW')
  findAll() {
    return this.campusesService.findAll();
  }

  @Get(':id')
  @RequirePermission(ModuleId.CAMPUSES, 'VIEW')
  findOne(@Param('id') id: string) {
    return this.campusesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission(ModuleId.CAMPUSES, 'EDIT')
  update(@Param('id') id: string, @Body() data: any) {
    return this.campusesService.update(id, data);
  }

  @Delete(':id')
  @RequirePermission(ModuleId.CAMPUSES, 'DELETE')
  remove(@Param('id') id: string) {
    return this.campusesService.remove(id);
  }
}
