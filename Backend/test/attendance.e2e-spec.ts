import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { AttendanceService } from '../src/attendance/attendance.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('AttendanceController (e2e)', () => {
  let app: INestApplication;
  
  const mockService = {
    markAttendance: jest.fn().mockResolvedValue({ id: '1' }),
    bulkMarkAttendance: jest.fn().mockResolvedValue({ id: '1' }),
    markBiometric: jest.fn().mockResolvedValue({ id: '1' }),
    getAttendance: jest.fn().mockResolvedValue({ id: '1' }),
    getAttendanceSummary: jest.fn().mockResolvedValue({ id: '1' }),
    updateAttendance: jest.fn().mockResolvedValue({ id: '1' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(AttendanceService)
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

  it('/attendance (POST)', () => {
    return request(app.getHttpServer())
      .post('/attendance')
      .send({})
      .expect(201);
  });

  it('/attendance (GET)', () => {
    return request(app.getHttpServer())
      .get('/attendance')
      .expect(200);
  });

  it('/attendance/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/attendance/1')
      .send({})
      .expect(200);
  });

});
