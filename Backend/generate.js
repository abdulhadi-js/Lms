const fs = require('fs');
const path = require('path');
const basePath = 'C:\\\\Users\\\\saadi\\\\OneDrive\\\\Desktop\\\\LMS project\\\\Backend\\\\src';

const files = {
  // COURSES MODULE
  'courses/dto/create-course.dto.ts': `import { IsString, IsOptional, IsUUID, IsInt } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @IsOptional()
  @IsInt()
  credits?: number = 3;
}
`,
  'courses/dto/update-course.dto.ts': `import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { IsOptional, IsEnum } from 'class-validator';

export enum CourseStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;
}
`,
  'courses/dto/create-module.dto.ts': `import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}
`,
  'courses/dto/create-lesson.dto.ts': `import { IsString, IsOptional, IsInt, IsUrl, IsEnum } from 'class-validator';

export enum ContentType {
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  QUIZ = 'QUIZ',
}

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ContentType)
  contentType: ContentType;

  @IsOptional()
  @IsUrl()
  contentUrl?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsInt()
  duration?: number;
}
`,
  'courses/entities/course.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { CourseModule } from './module.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  teacherId: string;

  @Column({ default: 3 })
  credits: number;

  @Column({ default: 'ACTIVE' })
  status: string;

  @OneToMany(() => CourseModule, module => module.course)
  modules: CourseModule[];
}
`,
  'courses/entities/module.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity('modules')
export class CourseModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  order: number;

  @Column()
  courseId: string;

  @ManyToOne(() => Course, course => course.modules)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @OneToMany(() => Lesson, lesson => lesson.module)
  lessons: Lesson[];
}
`,
  'courses/entities/lesson.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CourseModule } from './module.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  contentType: string;

  @Column({ nullable: true })
  contentUrl: string;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  duration: number;

  @Column()
  moduleId: string;

  @ManyToOne(() => CourseModule, module => module.lessons)
  @JoinColumn({ name: 'moduleId' })
  module: CourseModule;
}
`,
  'courses/courses.service.ts': `import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
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
      return this.courseRepo.query('SELECT c.* FROM courses c INNER JOIN enrollments e ON c.id = e."courseId" WHERE e."studentId" = $1', [currentUser.id]);
    }
    return [];
  }

  async findOne(id: string) {
    const course = await this.courseRepo.findOne({ where: { id }, relations: ['modules', 'modules.lessons'] });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: string, dto: UpdateCourseDto, currentUser: any) {
    const course = await this.findOne(id);
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
    const course = await this.findOne(id);
    course.status = 'ARCHIVED';
    return this.courseRepo.save(course);
  }

  async assignTeacher(courseId: string, teacherId: string) {
    const course = await this.findOne(courseId);
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
    return this.moduleRepo.find({ where: { courseId }, order: { order: 'ASC' }, relations: ['lessons'] });
  }
}
`,
  'courses/courses.controller.ts': `import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ForbiddenException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller('courses')
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
export class ModulesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post(':moduleId/lessons')
  createLesson(@Param('moduleId') moduleId: string, @Body() createLessonDto: CreateLessonDto, @Request() req: any) {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'TEACHER') throw new ForbiddenException();
    return this.coursesService.createLesson(moduleId, createLessonDto);
  }
}
`,
  'courses/courses.module.ts': `import { Module } from '@nestjs/common';
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
`,

  // ENROLLMENTS MODULE
  'enrollments/dto/create-enrollment.dto.ts': `import { IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  courseId: string;
}
`,
  'enrollments/dto/create-application.dto.ts': `import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  desiredCourse: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
`,
  'enrollments/dto/review-application.dto.ts': `import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ApplicationStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ReviewApplicationDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
`,
  'enrollments/dto/request-drop.dto.ts': `import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum DropType {
  COURSE = 'COURSE',
  FULL = 'FULL',
}

export class RequestDropDto {
  @IsString()
  reason: string;

  @IsEnum(DropType)
  dropType: DropType;

  @IsOptional()
  @IsUUID()
  courseId?: string;
}
`,
  'enrollments/entities/enrollment.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column()
  courseId: string;

  @Column({ default: 'ENROLLED' })
  status: string;

  @Column({ nullable: true })
  dropReason: string;

  @Column({ nullable: true })
  droppedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
`,
  'enrollments/entities/application.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  desiredCourse: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: 'PENDING_REVIEW' })
  status: string;

  @Column({ nullable: true })
  reviewNotes: string;

  @CreateDateColumn()
  createdAt: Date;
}
`,
  'enrollments/enrollments.service.ts': `import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Application } from './entities/application.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { RequestDropDto } from './dto/request-drop.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment) private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Application) private appRepo: Repository<Application>,
  ) {}

  async directEnroll(dto: CreateEnrollmentDto) {
    const enrollment = this.enrollmentRepo.create(dto);
    await this.enrollmentRepo.save(enrollment);
    console.log(\`Audit: Direct enroll for student \${dto.studentId} in course \${dto.courseId}\`);
    return enrollment;
  }

  async applyForCourse(dto: CreateApplicationDto) {
    const app = this.appRepo.create({ ...dto, status: 'PENDING_REVIEW' });
    return this.appRepo.save(app);
  }

  async reviewApplication(id: string, dto: ReviewApplicationDto, adminId: string) {
    const app = await this.appRepo.findOne({ where: { id } });
    if (!app) throw new NotFoundException();
    app.status = dto.status;
    app.reviewNotes = dto.notes;
    await this.appRepo.save(app);

    if (dto.status === 'APPROVED') {
      console.log(\`Audit: Admin \${adminId} approved application \${id}. Need to create user & enroll.\`);
    } else {
      console.log(\`Audit: Admin \${adminId} rejected application \${id}\`);
    }
    return app;
  }

  async getApplications(status?: string) {
    return status ? this.appRepo.find({ where: { status } }) : this.appRepo.find();
  }

  async requestDrop(studentId: string, enrollmentId: string, dto: RequestDropDto) {
    const enrollment = await this.enrollmentRepo.findOne({ where: { id: enrollmentId, studentId } });
    if (!enrollment) throw new NotFoundException();
    enrollment.status = 'DROP_REQUESTED';
    enrollment.dropReason = dto.reason;
    await this.enrollmentRepo.save(enrollment);
    console.log(\`Audit: Student \${studentId} requested drop for enrollment \${enrollmentId}\`);
    return enrollment;
  }

  async reviewDropRequest(enrollmentId: string, approved: boolean, adminId: string) {
    const enrollment = await this.enrollmentRepo.findOne({ where: { id: enrollmentId } });
    if (!enrollment) throw new NotFoundException();
    if (approved) {
      enrollment.status = 'DROPPED';
      enrollment.droppedAt = new Date();
      console.log(\`Audit: Admin \${adminId} approved drop for \${enrollmentId}\`);
    } else {
      enrollment.status = 'ENROLLED';
      console.log(\`Audit: Admin \${adminId} rejected drop for \${enrollmentId}\`);
    }
    return this.enrollmentRepo.save(enrollment);
  }

  async adminDrop(enrollmentId: string, reason: string, adminId: string) {
    const enrollment = await this.enrollmentRepo.findOne({ where: { id: enrollmentId } });
    if (!enrollment) throw new NotFoundException();
    enrollment.status = 'DROPPED';
    enrollment.dropReason = reason;
    enrollment.droppedAt = new Date();
    await this.enrollmentRepo.save(enrollment);
    console.log(\`Audit: Admin \${adminId} directly dropped \${enrollmentId}\`);
    return enrollment;
  }

  async findEnrollments(currentUser: any) {
    if (currentUser.role === 'ADMIN') return this.enrollmentRepo.find();
    if (currentUser.role === 'STUDENT') return this.enrollmentRepo.find({ where: { studentId: currentUser.id } });
    return [];
  }
}
`,
  'enrollments/enrollments.controller.ts': `import { Controller, Get, Post, Body, Patch, Param, Query, Request, ForbiddenException } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { RequestDropDto } from './dto/request-drop.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  directEnroll(@Body() dto: CreateEnrollmentDto, @Request() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.enrollmentsService.directEnroll(dto);
  }

  @Get()
  findEnrollments(@Request() req: any) {
    return this.enrollmentsService.findEnrollments(req.user);
  }

  @Post(':id/drop')
  requestDrop(@Param('id') id: string, @Body() dto: RequestDropDto, @Request() req: any) {
    if (req.user?.role === 'ADMIN') {
      return this.enrollmentsService.adminDrop(id, dto.reason, req.user.id);
    }
    return this.enrollmentsService.requestDrop(req.user?.id, id, dto);
  }

  @Patch(':id/drop/review')
  reviewDropRequest(@Param('id') id: string, @Body('approved') approved: boolean, @Request() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.enrollmentsService.reviewDropRequest(id, approved, req.user.id);
  }
}

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  apply(@Body() dto: CreateApplicationDto) {
    return this.enrollmentsService.applyForCourse(dto);
  }

  @Get()
  getApplications(@Query('status') status: string, @Request() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.enrollmentsService.getApplications(status);
  }

  @Patch(':id/review')
  reviewApplication(@Param('id') id: string, @Body() dto: ReviewApplicationDto, @Request() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.enrollmentsService.reviewApplication(id, dto, req.user.id);
  }
}
`,
  'enrollments/enrollments.module.ts': `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController, ApplicationsController } from './enrollments.controller';
import { Enrollment } from './entities/enrollment.entity';
import { Application } from './entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Application])],
  controllers: [EnrollmentsController, ApplicationsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
`,

  // ASSIGNMENTS MODULE
  'assignments/dto/create-assignment.dto.ts': `import { IsUUID, IsString, IsOptional, IsNumber, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class RubricDto {
  @IsString()
  criterion: string;

  @IsString()
  description: string;

  @IsNumber()
  maxPoints: number;
}

export class CreateAssignmentDto {
  @IsUUID()
  courseId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  rubric?: RubricDto[];

  @IsNumber()
  maxMarks: number;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @IsOptional()
  @IsNumber()
  weightPercent?: number;
}
`,
  'assignments/dto/submit-assignment.dto.ts': `import { IsOptional, IsString } from 'class-validator';

export class SubmitAssignmentDto {
  @IsOptional()
  @IsString()
  textContent?: string;
}
`,
  'assignments/dto/grade-submission.dto.ts': `import { IsNumber, IsString } from 'class-validator';

export class GradeSubmissionDto {
  @IsNumber()
  grade: number;

  @IsString()
  feedback: string;
}
`,
  'assignments/entities/assignment.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courseId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('jsonb', { nullable: true })
  rubric: any;

  @Column()
  maxMarks: number;

  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  weightPercent: number;
}
`,
  'assignments/entities/submission.entity.ts': `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assignmentId: string;

  @Column()
  studentId: string;

  @Column({ nullable: true })
  textContent: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ nullable: true })
  grade: number;

  @Column({ nullable: true })
  feedback: string;

  @Column({ nullable: true })
  graderId: string;

  @CreateDateColumn()
  submittedAt: Date;
}
`,
  'assignments/assignments.service.ts': `import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { Submission } from './entities/submission.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment) private assignmentRepo: Repository<Assignment>,
    @InjectRepository(Submission) private submissionRepo: Repository<Submission>,
  ) {}

  async create(dto: CreateAssignmentDto, teacherId: string) {
    const assignment = this.assignmentRepo.create(dto);
    return this.assignmentRepo.save(assignment);
  }

  async findAll(courseId: string, currentUser: any) {
    return this.assignmentRepo.find({ where: { courseId } });
  }

  async findOne(id: string) {
    const assignment = await this.assignmentRepo.findOne({ where: { id } });
    if (!assignment) throw new NotFoundException();
    const submissionsCount = await this.submissionRepo.count({ where: { assignmentId: id } });
    return { ...assignment, submissionsCount };
  }

  async update(id: string, dto: any, currentUser: any) {
    const assignment = await this.assignmentRepo.findOne({ where: { id } });
    if (!assignment) throw new NotFoundException();
    Object.assign(assignment, dto);
    return this.assignmentRepo.save(assignment);
  }

  async remove(id: string) {
    const assignment = await this.assignmentRepo.findOne({ where: { id } });
    if (!assignment) throw new NotFoundException();
    return this.assignmentRepo.remove(assignment);
  }

  async submitAssignment(assignmentId: string, studentId: string, dto: SubmitAssignmentDto, file?: any) {
    const assignment = await this.assignmentRepo.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException();
    if (new Date() > assignment.dueDate) throw new BadRequestException('Past due date');

    let submission = await this.submissionRepo.findOne({ where: { assignmentId, studentId } });
    if (!submission) {
      submission = this.submissionRepo.create({ assignmentId, studentId });
    }
    submission.textContent = dto.textContent;
    if (file) submission.fileUrl = file.path;
    
    return this.submissionRepo.save(submission);
  }

  async getSubmissions(assignmentId: string, currentUser: any) {
    if (currentUser.role === 'STUDENT') {
      return this.submissionRepo.find({ where: { assignmentId, studentId: currentUser.id } });
    }
    return this.submissionRepo.find({ where: { assignmentId } });
  }

  async gradeSubmission(submissionId: string, dto: GradeSubmissionDto, graderId: string) {
    const submission = await this.submissionRepo.findOne({ where: { id: submissionId } });
    if (!submission) throw new NotFoundException();
    submission.grade = dto.grade;
    submission.feedback = dto.feedback;
    submission.graderId = graderId;
    return this.submissionRepo.save(submission);
  }
}
`,
  'assignments/assignments.controller.ts': `import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseInterceptors, UploadedFile, ForbiddenException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';

@Controller()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('courses/:courseId/assignments')
  findAll(@Param('courseId') courseId: string, @Request() req: any) {
    return this.assignmentsService.findAll(courseId, req.user);
  }

  @Post('courses/:courseId/assignments')
  create(@Param('courseId') courseId: string, @Body() dto: CreateAssignmentDto, @Request() req: any) {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'TEACHER') throw new ForbiddenException();
    dto.courseId = courseId;
    return this.assignmentsService.create(dto, req.user.id);
  }

  @Get('assignments/:id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch('assignments/:id')
  update(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'TEACHER') throw new ForbiddenException();
    return this.assignmentsService.update(id, dto, req.user);
  }

  @Delete('assignments/:id')
  remove(@Param('id') id: string, @Request() req: any) {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'TEACHER') throw new ForbiddenException();
    return this.assignmentsService.remove(id);
  }

  @Post('assignments/:id/submissions')
  @UseInterceptors(FileInterceptor('file'))
  submitAssignment(
    @Param('id') id: string,
    @Body() dto: SubmitAssignmentDto,
    @UploadedFile() file: any,
    @Request() req: any
  ) {
    return this.assignmentsService.submitAssignment(id, req.user?.id, dto, file);
  }

  @Get('assignments/:id/submissions')
  getSubmissions(@Param('id') id: string, @Request() req: any) {
    return this.assignmentsService.getSubmissions(id, req.user);
  }

  @Patch('submissions/:id/grade')
  gradeSubmission(@Param('id') id: string, @Body() dto: GradeSubmissionDto, @Request() req: any) {
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'TEACHER') throw new ForbiddenException();
    return this.assignmentsService.gradeSubmission(id, dto, req.user?.id);
  }
}
`,
  'assignments/assignments.module.ts': `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment } from './entities/assignment.entity';
import { Submission } from './entities/submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Submission])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', fullPath);
}
