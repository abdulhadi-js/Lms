import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TimetableService } from '../src/timetable/timetable.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('TimetableController (e2e)', () => {
  let app: INestApplication;
  
  const mockService = {
    findAll: jest.fn().mockResolvedValue({ id: '1' }),
    create: jest.fn().mockResolvedValue({ id: '1' }),
    update: jest.fn().mockResolvedValue({ id: '1' }),
    remove: jest.fn().mockResolvedValue({ id: '1' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(TimetableService)
    .useValue(mockService)
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

  it('/timetable (POST)', () => {
    return request(app.getHttpServer())
      .post('/timetable')
      .send({})
      .expect(201);
  });

  it('/timetable (GET)', () => {
    return request(app.getHttpServer())
      .get('/timetable')
      .expect(200);
  });

  it('/timetable/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/timetable/1')
      .send({})
      .expect(200);
  });

  it('/timetable/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/timetable/1')
      .expect(200);
  });

});
