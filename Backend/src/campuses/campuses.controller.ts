import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CampusesService } from './campuses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Controller('campuses')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CampusesController {
  constructor(private readonly campusesService: CampusesService) {}

  @Post()
  create(@Body() data: any) {
    return this.campusesService.create(data);
  }

  @Get()
  findAll() {
    return this.campusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campusesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.campusesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campusesService.remove(id);
  }
}
