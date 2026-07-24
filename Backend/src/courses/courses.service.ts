import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CourseModule } from './entities/module.entity';
import { Lesson } from './entities/lesson.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(CourseModule) private moduleRepo: Repository<CourseModule>,
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
  ) {}

  async create(dto: CreateCourseDto, currentUser: any) {
    if (currentUser.role !== 'ADMIN') throw new ForbiddenException('Only admin can create courses');
    const course = this.courseRepo.create(dto);
    return this.courseRepo.save(course);
  }

  async findAll(currentUser: any) {
    if (currentUser.role === 'ADMIN') {
      return this.courseRepo.find();
    } else if (currentUser.role === 'TEACHER') {
      return this.courseRepo.find({ where: { teacherId: currentUser.id } });
    } else if (currentUser.role === 'STUDENT') {
      return this.courseRepo
        .createQueryBuilder('course')
        .innerJoin('course.enrollments', 'enrollment')
        .where('enrollment.studentId = :studentId', { studentId: currentUser.id })
        .andWhere('enrollment.status = :status', { status: 'ENROLLED' })
        .getMany();
    }
    return [];
  }

  async findOne(id: string) {
    // Use object notation for relations (TypeORM v0.3+ FindOptionsRelations)
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: { modules: { lessons: true } },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: string, dto: UpdateCourseDto, currentUser: any) {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    if (currentUser.role === 'TEACHER' && course.teacherId !== currentUser.id) {
      throw new ForbiddenException('You can only update your own assigned courses');
    }
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'TEACHER') {
      throw new ForbiddenException('Not authorized');
    }
    Object.assign(course, dto);
    return this.courseRepo.save(course);
  }

  async remove(id: string) {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    course.status = 'ARCHIVED' as any;
    return this.courseRepo.save(course);
  }

  async assignTeacher(courseId: string, teacherId: string) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    course.teacherId = teacherId;
    return this.courseRepo.save(course);
  }

  async createModule(courseId: string, dto: CreateModuleDto) {
    const module = this.moduleRepo.create({ ...dto, courseId });
    return this.moduleRepo.save(module);
  }

  async createLesson(moduleId: string, dto: CreateLessonDto) {
    const lesson = this.lessonRepo.create({ ...dto, moduleId });
    return this.lessonRepo.save(lesson);
  }

  async getModules(courseId: string) {
    // Use object notation for relations
    return this.moduleRepo.find({
      where: { courseId },
      order: { order: 'ASC' },
      relations: { lessons: true },
    });
  }
}
