import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { CampusesService } from '../src/campuses/campuses.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('CampusesController (e2e)', () => {
  let app: INestApplication;
  
  const mockCampusesService = {
    create: jest.fn().mockResolvedValue({ id: '1', name: 'Test Campus', location: 'Test Location' }),
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Test Campus', location: 'Test Location' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Test Campus', location: 'Test Location' }),
    update: jest.fn().mockResolvedValue({ id: '1', name: 'Updated Campus', location: 'Test Location' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(CampusesService)
    .useValue(mockCampusesService)
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

  it('/campuses (POST)', () => {
    return request(app.getHttpServer())
      .post('/campuses')
      .send({ name: 'Test Campus', location: 'Test Location' })
      .expect(201)
      .expect({ id: '1', name: 'Test Campus', location: 'Test Location' });
  });

  it('/campuses (GET)', () => {
    return request(app.getHttpServer())
      .get('/campuses')
      .expect(200)
      .expect([{ id: '1', name: 'Test Campus', location: 'Test Location' }]);
  });

  it('/campuses/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/campuses/1')
      .expect(200)
      .expect({ id: '1', name: 'Test Campus', location: 'Test Location' });
  });

  it('/campuses/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/campuses/1')
      .send({ name: 'Updated Campus' })
      .expect(200)
      .expect({ id: '1', name: 'Updated Campus', location: 'Test Location' });
  });

  it('/campuses/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/campuses/1')
      .expect(200);
  });
});
