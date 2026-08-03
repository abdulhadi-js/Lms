import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { MarksService } from '../src/marks/marks.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('MarksController (e2e)', () => {
  let app: INestApplication;
  
  const mockService = {
    getTranscript: jest.fn().mockResolvedValue({ id: '1' }),
    getGradebook: jest.fn().mockResolvedValue({ id: '1' }),
    enterMark: jest.fn().mockResolvedValue({ id: '1' }),
    updateMark: jest.fn().mockResolvedValue({ id: '1' }),
    generateTranscriptPdf: jest.fn().mockResolvedValue({ id: '1' }),
    getGradingCriteria: jest.fn().mockResolvedValue({ id: '1' }),
    createGradingCriteria: jest.fn().mockResolvedValue({ id: '1' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(MarksService)
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

  it('/marks (POST)', () => {
    return request(app.getHttpServer())
      .post('/marks')
      .send({})
      .expect(201);
  });

  it('/marks (GET)', () => {
    return request(app.getHttpServer())
      .get('/marks')
      .expect(200);
  });

  it('/marks/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/marks/1')
      .send({})
      .expect(200);
  });

});
