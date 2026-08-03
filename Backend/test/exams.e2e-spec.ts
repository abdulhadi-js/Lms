import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { ExamsService } from '../src/exams/exams.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('ExamsController (e2e)', () => {
  let app: INestApplication;
  
  const mockService = {
    getQuestions: jest.fn().mockResolvedValue({ id: '1' }),
    createQuestion: jest.fn().mockResolvedValue({ id: '1' }),
    updateQuestion: jest.fn().mockResolvedValue({ id: '1' }),
    deleteQuestion: jest.fn().mockResolvedValue({ id: '1' }),
    getExams: jest.fn().mockResolvedValue({ id: '1' }),
    getExam: jest.fn().mockResolvedValue({ id: '1' }),
    createExam: jest.fn().mockResolvedValue({ id: '1' }),
    updateExam: jest.fn().mockResolvedValue({ id: '1' }),
    deleteExam: jest.fn().mockResolvedValue({ id: '1' }),
    assignQuestionsToExam: jest.fn().mockResolvedValue({ id: '1' }),
    submitExam: jest.fn().mockResolvedValue({ id: '1' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(ExamsService)
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

  it('/exams (POST)', () => {
    return request(app.getHttpServer())
      .post('/exams')
      .send({})
      .expect(201);
  });

  it('/exams (GET)', () => {
    return request(app.getHttpServer())
      .get('/exams')
      .expect(200);
  });

  it('/exams/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/exams/1')
      .expect(200);
  });

  it('/exams/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/exams/1')
      .expect(200);
  });

});
