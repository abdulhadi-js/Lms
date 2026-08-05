import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { RolesService } from '../src/roles/roles.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('RolesController (e2e)', () => {
  let app: INestApplication;
  
  const mockRolesService = {
    create: jest.fn().mockResolvedValue({ id: '1', name: 'Admin', description: 'Administrator' }),
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Admin', description: 'Administrator' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Admin', description: 'Administrator' }),
    update: jest.fn().mockResolvedValue({ id: '1', name: 'Super Admin', description: 'Global Administrator' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(RolesService)
    .useValue(mockRolesService)
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (context: any) => {
        const req = context.switchToHttp().getRequest();
        req.user = { id: 'u1', isSuperAdmin: true, role: { name: 'SUPERADMIN' } };
        return true;
      }
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

  it('/roles (POST)', () => {
    return request(app.getHttpServer())
      .post('/roles')
      .send({ name: 'Admin', description: 'Administrator' })
      .expect(201)
      .expect({ id: '1', name: 'Admin', description: 'Administrator' });
  });

  it('/roles (GET)', () => {
    return request(app.getHttpServer())
      .get('/roles')
      .expect(200)
      .expect([{ id: '1', name: 'Admin', description: 'Administrator' }]);
  });

  it('/roles/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/roles/1')
      .expect(200)
      .expect({ id: '1', name: 'Admin', description: 'Administrator' });
  });

  it('/roles/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/roles/1')
      .send({ name: 'Super Admin', description: 'Global Administrator' })
      .expect(200)
      .expect({ id: '1', name: 'Super Admin', description: 'Global Administrator' });
  });

  it('/roles/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/roles/1')
      .expect(200);
  });
});
