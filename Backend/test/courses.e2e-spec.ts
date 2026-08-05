import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { CoursesService } from '../src/courses/courses.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

describe('CoursesController (e2e)', () => {
  let app: INestApplication;

  const mockCourse = {
    id: 'course-1',
    title: 'Introduction to Python',
    description: 'A beginner Python course',
    campusId: 'campus-1',
  };

  const mockModule = {
    id: 'mod-1',
    courseId: 'course-1',
    title: 'Module 1: Basics',
    order: 1,
  };

  const mockCoursesService = {
    findPublic: jest.fn().mockResolvedValue([mockCourse]),
    create: jest.fn().mockResolvedValue(mockCourse),
    findAll: jest.fn().mockResolvedValue([mockCourse]),
    findOne: jest.fn().mockResolvedValue(mockCourse),
    update: jest.fn().mockResolvedValue({ ...mockCourse, title: 'Advanced Python' }),
    remove: jest.fn().mockResolvedValue(undefined),
    createModule: jest.fn().mockResolvedValue(mockModule),
    getModules: jest.fn().mockResolvedValue([mockModule]),
    updateModule: jest.fn().mockResolvedValue({ ...mockModule, title: 'Module 1: Updated' }),
    removeModule: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CoursesService)
      .useValue(mockCoursesService)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 'u1', isSuperAdmin: true, campusId: 'campus-1' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/public/courses (GET) - should return public courses', () => {
    return request(app.getHttpServer())
      .get('/public/courses')
      .expect(200)
      .expect([mockCourse]);
  });

  it('/courses (POST) - should create a course', () => {
    return request(app.getHttpServer())
      .post('/courses')
      .send({ title: 'Introduction to Python', description: 'A beginner Python course' })
      .expect(201)
      .expect(mockCourse);
  });

  it('/courses (GET) - should return all courses', () => {
    return request(app.getHttpServer())
      .get('/courses')
      .expect(200)
      .expect([mockCourse]);
  });

  it('/courses/:id (GET) - should return a single course', () => {
    return request(app.getHttpServer())
      .get('/courses/course-1')
      .expect(200)
      .expect(mockCourse);
  });

  it('/courses/:id (PATCH) - should update a course', () => {
    return request(app.getHttpServer())
      .patch('/courses/course-1')
      .send({ title: 'Advanced Python' })
      .expect(200)
      .expect({ ...mockCourse, title: 'Advanced Python' });
  });

  it('/courses/:id/modules (POST) - should create a module', () => {
    return request(app.getHttpServer())
      .post('/courses/course-1/modules')
      .send({ title: 'Module 1: Basics', order: 1 })
      .expect(201)
      .expect(mockModule);
  });

  it('/courses/:id/modules (GET) - should return course modules', () => {
    return request(app.getHttpServer())
      .get('/courses/course-1/modules')
      .expect(200)
      .expect([mockModule]);
  });

  it('/courses/:id/modules/:modId (PATCH) - should update a module', () => {
    return request(app.getHttpServer())
      .patch('/courses/course-1/modules/mod-1')
      .send({ title: 'Module 1: Updated' })
      .expect(200)
      .expect({ ...mockModule, title: 'Module 1: Updated' });
  });

  it('/courses/:id/modules/:modId (DELETE) - should remove a module', () => {
    return request(app.getHttpServer())
      .delete('/courses/course-1/modules/mod-1')
      .expect(200);
  });

  it('/courses/:id (DELETE) - should remove a course', () => {
    return request(app.getHttpServer())
      .delete('/courses/course-1')
      .expect(200);
  });
});
