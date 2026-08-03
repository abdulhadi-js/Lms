import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CourseModule } from './entities/course-module.entity';
import { CourseLesson } from './entities/course-lesson.entity';
import { CreateCourseDto, UpdateCourseDto, CreateCourseModuleDto, CreateCourseLessonDto } from './dto/courses.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(CourseModule)
    private moduleRepo: Repository<CourseModule>,
    @InjectRepository(CourseLesson)
    private lessonRepo: Repository<CourseLesson>,
  ) {}

  async create(dto: CreateCourseDto, user: any) {
    const course = this.courseRepo.create({
      ...dto,
      teacherId: user.id,
      campusId: user.campusId,
    });
    return this.courseRepo.save(course);
  }

  async findAll(user: any) {
    const where: any = {};
    if (!user.isSuperAdmin && user.campusId) {
      where.campusId = user.campusId;
    }
    // Teachers only see their own courses. Admins see all. Students see all public (but enrollments check later).
    if (user.role === 'INSTRUCTOR') {
      where.teacherId = user.id;
    }
    return this.courseRepo.find({ where, relations: { teacher: true } });
  }

  async findPublic() {
    return this.courseRepo.find({ relations: { teacher: true } });
  }

  async findOne(id: string, user: any) {
    const where: any = { id };
    if (!user.isSuperAdmin && user.campusId) {
      where.campusId = user.campusId;
    }
    const course = await this.courseRepo.findOne({ where, relations: { teacher: true, modules: { lessons: true } } });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: string, dto: UpdateCourseDto, user: any) {
    const course = await this.findOne(id, user);
    if (user.role === 'INSTRUCTOR' && course.teacherId !== user.id) {
      throw new ForbiddenException('Not allowed');
    }
    Object.assign(course, dto);
    return this.courseRepo.save(course);
  }

  async remove(id: string, user: any) {
    const course = await this.findOne(id, user);
    if (user.role === 'INSTRUCTOR' && course.teacherId !== user.id) {
      throw new ForbiddenException('Not allowed');
    }
    return this.courseRepo.remove(course);
  }

  async createModule(courseId: string, dto: CreateCourseModuleDto, user: any) {
    const course = await this.findOne(courseId, user);
    if (user.role === 'INSTRUCTOR' && course.teacherId !== user.id) {
      throw new ForbiddenException('Not allowed');
    }
    const mod = this.moduleRepo.create({ ...dto, courseId });
    return this.moduleRepo.save(mod);
  }

  async getModules(courseId: string, user: any) {
    // Wait, findOne already checks campusId
    await this.findOne(courseId, user);
    return this.moduleRepo.find({ where: { courseId }, relations: { lessons: true } });
  }

  async updateModule(courseId: string, modId: string, dto: any, user: any) {
    const course = await this.findOne(courseId, user);
    if (user.role === 'INSTRUCTOR' && course.teacherId !== user.id) throw new ForbiddenException();
    
    const mod = await this.moduleRepo.findOne({ where: { id: modId, courseId } });
    if (!mod) throw new NotFoundException();
    
    Object.assign(mod, dto);
    return this.moduleRepo.save(mod);
  }

  async removeModule(courseId: string, modId: string, user: any) {
    const course = await this.findOne(courseId, user);
    if (user.role === 'INSTRUCTOR' && course.teacherId !== user.id) throw new ForbiddenException();

    const mod = await this.moduleRepo.findOne({ where: { id: modId, courseId } });
    if (!mod) throw new NotFoundException();
    
    return this.moduleRepo.remove(mod);
  }
}
