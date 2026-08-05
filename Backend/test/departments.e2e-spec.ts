import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DepartmentsService } from '../src/departments/departments.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('DepartmentsController (e2e)', () => {
  let app: INestApplication;

  const mockDept = {
    id: 'dept-1',
    name: 'Computer Science',
    campusId: 'campus-1',
  };

  const mockDepartmentsService = {
    create: jest.fn().mockResolvedValue(mockDept),
    findAll: jest.fn().mockResolvedValue([mockDept]),
    findOne: jest.fn().mockResolvedValue(mockDept),
    update: jest.fn().mockResolvedValue({ ...mockDept, name: 'Software Engineering' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DepartmentsService)
      .useValue(mockDepartmentsService)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 'u1', isSuperAdmin: true, campusId: 'campus-1' };
          return true;
        },
      })
      .overrideGuard(MatrixGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/departments (POST) - should create a department', () => {
    return request(app.getHttpServer())
      .post('/departments')
      .send({ name: 'Computer Science', campusId: 'campus-1' })
      .expect(201)
      .expect(mockDept);
  });

  it('/departments (GET) - should return all departments', () => {
    return request(app.getHttpServer())
      .get('/departments')
      .expect(200)
      .expect([mockDept]);
  });

  it('/departments/:id (GET) - should return a single department', () => {
    return request(app.getHttpServer())
      .get('/departments/dept-1')
      .expect(200)
      .expect(mockDept);
  });

  it('/departments/:id (PATCH) - should update a department', () => {
    return request(app.getHttpServer())
      .patch('/departments/dept-1')
      .send({ name: 'Software Engineering' })
      .expect(200)
      .expect({ ...mockDept, name: 'Software Engineering' });
  });

  it('/departments/:id (DELETE) - should delete a department', () => {
    return request(app.getHttpServer())
      .delete('/departments/dept-1')
      .expect(200);
  });
});
