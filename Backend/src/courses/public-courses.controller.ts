import { Controller, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('public/courses')
export class PublicCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findPublic();
  }
}
