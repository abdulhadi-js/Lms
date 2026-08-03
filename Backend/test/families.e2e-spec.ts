import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { FamiliesService } from '../src/families/families.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('FamiliesController (e2e)', () => {
  let app: INestApplication;
  
  const mockService = {
    findAll: jest.fn().mockResolvedValue({ id: '1' }),
    findOne: jest.fn().mockResolvedValue({ id: '1' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(FamiliesService)
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

  it('/families (GET)', () => {
    return request(app.getHttpServer())
      .get('/families')
      .expect(200);
  });

  it('/families/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/families/1')
      .expect(200);
  });

});
