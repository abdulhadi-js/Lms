import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AcademicsService } from './academics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import {
  CreateAcademicClassDto, UpdateAcademicClassDto,
  CreateSectionDto, UpdateSectionDto,
  CreateSubjectDto, UpdateSubjectDto,
  AssignTeacherDto
} from './dto/academics.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('academics')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @RequirePermissions('MANAGE_ACADEMICS')
  @Post('classes')
  createClass(@Body() dto: CreateAcademicClassDto, @CurrentUser() user: any) {
    return this.academicsService.createClass(dto, user);
  }

  @Get('classes')
  findAllClasses(@CurrentUser() user: any) {
    return this.academicsService.findAllClasses(user);
  }

  @Get('classes/:id')
  findClassById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.academicsService.findClassById(id, user);
  }

  @RequirePermissions('MANAGE_ACADEMICS')
  @Put('classes/:id')
  updateClass(@Param('id') id: string, @Body() dto: UpdateAcademicClassDto, @CurrentUser() user: any) {
    return this.academicsService.updateClass(id, dto, user);
  }

  @RequirePermissions('MANAGE_ACADEMICS')
  @Delete('classes/:id')
  removeClass(@Param('id') id: string, @CurrentUser() user: any) {
    return this.academicsService.removeClass(id, user);
  }

  @RequirePermissions('MANAGE_ACADEMICS')
  @Post('sections')
  createSection(@Body() dto: CreateSectionDto, @CurrentUser() user: any) {
    return this.academicsService.createSection(dto, user);
  }

  @RequirePermissions('MANAGE_ACADEMICS')
  @Put('sections/:id')
  updateSection(@Param('id') id: string, @Body() dto: UpdateSectionDto, @CurrentUser() user: any) {
    return this.academicsService.updateSection(id, dto, user);
  }

  @RequirePermissions('MANAGE_ACADEMICS')
  @Delete('sections/:id')
  removeSection(@Param('id') id: string, @CurrentUser() user: any) {
    return this.academicsService.removeSection(id, user);
  }

  @RequirePermissions('MANAGE_ACADEMICS')
  @Post('subjects')
  createSubject(@Body() dto: CreateSubjectDto, @CurrentUser() user: any) {
    return this.academicsService.createSubject(dto, user);
  }

  @RequirePermissions('MANAGE_ACADEMICS')
  @Put('subjects/:id')
  updateSubject(@Param('id') id: string, @Body() dto: UpdateSubjectDto, @CurrentUser() user: any) {
    return this.academicsService.updateSubject(id, dto, user);
  }

  @RequirePermissions('MANAGE_ACADEMICS')
  @Delete('subjects/:id')
  removeSubject(@Param('id') id: string, @CurrentUser() user: any) {
    return this.academicsService.removeSubject(id, user);
  }

  @RequirePermissions('MANAGE_ACADEMICS')
  @Post('assignments')
  assignTeacher(@Body() dto: AssignTeacherDto, @CurrentUser() user: any) {
    return this.academicsService.assignTeacher(dto, user);
  }

  @RequirePermissions('MANAGE_ACADEMICS')
  @Delete('assignments/:id')
  removeTeacherAssignment(@Param('id') id: string, @CurrentUser() user: any) {
    return this.academicsService.removeTeacherAssignment(id, user);
  }
}
