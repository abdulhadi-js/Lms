import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from '../src/users/users.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  
  const mockUsersService = {
    create: jest.fn().mockResolvedValue({ id: '1', email: 'test@test.com' }),
    findAll: jest.fn().mockResolvedValue([{ id: '1', email: 'test@test.com' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', email: 'test@test.com' }),
    update: jest.fn().mockResolvedValue({ id: '1', email: 'updated@test.com' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(UsersService)
    .useValue(mockUsersService)
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

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'test@test.com', password: 'Password@123' })
      .expect(201);
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200);
  });

  it('/users/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(200);
  });

  it('/users/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/users/1')
      .send({ email: 'updated@test.com' })
      .expect(200);
  });

  it('/users/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/users/1')
      .expect(200);
  });
});
