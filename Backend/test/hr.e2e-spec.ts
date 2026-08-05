import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { HrService } from '../src/hr/hr.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('HrController (e2e)', () => {
  let app: INestApplication;

  const mockProfile = {
    id: 'profile-1',
    userId: 'user-1',
    designation: 'Lecturer',
    qualification: 'MSc Computer Science',
    experience: 5,
  };

  const mockHrService = {
    getStaffProfile: jest.fn().mockResolvedValue(mockProfile),
    updateStaffProfile: jest.fn().mockResolvedValue({ ...mockProfile, designation: 'Senior Lecturer' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HrService)
      .useValue(mockHrService)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 'u1', isSuperAdmin: true };
          return true;
        },
      })
      .overrideGuard(MatrixGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/hr/profile/:userId (GET) - should return staff profile', () => {
    return request(app.getHttpServer())
      .get('/hr/profile/user-1')
      .expect(200)
      .expect(mockProfile);
  });

  it('/hr/profile/:userId (PUT) - should update staff profile', () => {
    return request(app.getHttpServer())
      .put('/hr/profile/user-1')
      .send({ designation: 'Senior Lecturer' })
      .expect(200)
      .expect({ ...mockProfile, designation: 'Senior Lecturer' });
  });
});
