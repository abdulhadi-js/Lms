import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto, CreateCourseModuleDto } from './dto/courses.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('public/courses')
export class PublicCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findPublic() {
    return this.coursesService.findPublic();
  }
}

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @CurrentUser() user: any) {
    return this.coursesService.create(createCourseDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.coursesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @CurrentUser() user: any) {
    return this.coursesService.update(id, updateCourseDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.remove(id, user);
  }

  @Post(':id/modules')
  createModule(@Param('id') id: string, @Body() dto: CreateCourseModuleDto, @CurrentUser() user: any) {
    return this.coursesService.createModule(id, dto, user);
  }

  @Get(':id/modules')
  getModules(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.getModules(id, user);
  }

  @Patch(':id/modules/:modId')
  updateModule(@Param('id') id: string, @Param('modId') modId: string, @Body() dto: any, @CurrentUser() user: any) {
    return this.coursesService.updateModule(id, modId, dto, user);
  }

  @Delete(':id/modules/:modId')
  removeModule(@Param('id') id: string, @Param('modId') modId: string, @CurrentUser() user: any) {
    return this.coursesService.removeModule(id, modId, user);
  }
}
