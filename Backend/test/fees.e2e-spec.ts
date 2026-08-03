import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { FeesService } from '../src/fees/fees.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('FeesController (e2e)', () => {
  let app: INestApplication;
  
  const mockFeesService = {
    create: jest.fn().mockResolvedValue({ id: '1', amount: 100 }),
    findAll: jest.fn().mockResolvedValue([{ id: '1', amount: 100 }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', amount: 100 }),
    update: jest.fn().mockResolvedValue({ id: '1', amount: 150 }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(FeesService)
    .useValue(mockFeesService)
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

  it('/fees (POST)', () => {
    return request(app.getHttpServer())
      .post('/fees')
      .send({ amount: 100, studentId: 'stu-1' })
      .expect(201);
  });

  it('/fees (GET)', () => {
    return request(app.getHttpServer())
      .get('/fees')
      .expect(200);
  });

  it('/fees/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/fees/1')
      .expect(200);
  });

  it('/fees/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/fees/1')
      .send({ amount: 150 })
      .expect(200);
  });

  it('/fees/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/fees/1')
      .expect(200);
  });
});
