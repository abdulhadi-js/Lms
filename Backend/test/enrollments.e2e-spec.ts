import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { EnrollmentsService } from '../src/enrollments/enrollments.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('EnrollmentsController (e2e)', () => {
  let app: INestApplication;
  
  const mockEnrollmentsService = {
    directEnroll: jest.fn().mockResolvedValue({ id: '1', status: 'ACTIVE' }),
    findEnrollments: jest.fn().mockResolvedValue([[{ id: '1', status: 'ACTIVE' }], 1]),
    reviewDropRequest: jest.fn().mockResolvedValue({ id: '1', status: 'COMPLETED' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(EnrollmentsService)
    .useValue(mockEnrollmentsService)
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(MatrixGuard)
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/enrollments (POST)', () => {
    return request(app.getHttpServer())
      .post('/enrollments')
      .send({ studentId: 'student-id', classId: 'class-id' })
      .expect(201);
  });

  it('/enrollments (GET)', () => {
    return request(app.getHttpServer())
      .get('/enrollments')
      .expect(200);
  });

  it('/enrollments/1/drop/review (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/enrollments/1/drop/review')
      .send({ approved: true })
      .expect(200);
  });

  it('/enrollments/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/enrollments/1')
      .expect(200);
  });
});
