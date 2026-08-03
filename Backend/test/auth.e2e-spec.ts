import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  
  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'token', user: { id: '1' } }),
    forgotPassword: jest.fn().mockResolvedValue({ message: 'Email sent' }),
    resetPassword: jest.fn().mockResolvedValue({ message: 'Password updated' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(AuthService)
    .useValue(mockAuthService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(200)
      .expect({ access_token: 'token', user: { id: '1' } });
  });

  it('/auth/forgot-password (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: 'test@test.com' })
      .expect(200);
  });
});
