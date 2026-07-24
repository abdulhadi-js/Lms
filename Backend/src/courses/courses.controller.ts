import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ForbiddenException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.coursesService.findAll(req.user);
  }

  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Request() req: any) {
    return this.coursesService.create(createCourseDto, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Request() req: any) {
    return this.coursesService.update(id, updateCourseDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.coursesService.remove(id);
  }

  @Post(':id/assign-teacher')
  assignTeacher(@Param('id') id: string, @Body('teacherId') teacherId: string, @Request() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.coursesService.assignTeacher(id, teacherId);
  }

  @Get(':id/modules')
  getModules(@Param('id') id: string) {
    return this.coursesService.getModules(id);
  }

  @Post(':id/modules')
  createModule(@Param('id') id: string, @Body() createModuleDto: CreateModuleDto, @Request() req: any) {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'TEACHER') throw new ForbiddenException();
    return this.coursesService.createModule(id, createModuleDto);
  }
}

@Controller('modules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModulesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post(':moduleId/lessons')
  createLesson(@Param('moduleId') moduleId: string, @Body() createLessonDto: CreateLessonDto, @Request() req: any) {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'TEACHER') throw new ForbiddenException();
    return this.coursesService.createLesson(moduleId, createLessonDto);
  }
}
