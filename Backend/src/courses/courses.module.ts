import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController, ModulesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { CourseModule } from './entities/module.entity';
import { Lesson } from './entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, CourseModule, Lesson])],
  controllers: [CoursesController, ModulesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
