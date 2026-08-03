import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { AssignmentsService } from '../src/assignments/assignments.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('AssignmentsController (e2e)', () => {
  let app: INestApplication;
  
  const mockAssignmentsService = {
    create: jest.fn().mockResolvedValue({ id: '1', title: 'Math Test' }),
    findAllGlobal: jest.fn().mockResolvedValue([{ id: '1', title: 'Math Test' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', title: 'Math Test' }),
    update: jest.fn().mockResolvedValue({ id: '1', title: 'Updated Test' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(AssignmentsService)
    .useValue(mockAssignmentsService)
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

  it('/assignments (POST)', () => {
    return request(app.getHttpServer())
      .post('/assignments')
      .send({ title: 'Math Test', dueDate: '2026-08-01' })
      .expect(201);
  });

  it('/assignments (GET)', () => {
    return request(app.getHttpServer())
      .get('/assignments')
      .expect(200);
  });

  it('/assignments/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/assignments/1')
      .expect(200);
  });

  it('/assignments/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/assignments/1')
      .send({ title: 'Updated Test' })
      .expect(200);
  });

  it('/assignments/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/assignments/1')
      .expect(200);
  });
});
