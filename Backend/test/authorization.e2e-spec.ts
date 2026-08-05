import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Controller, Post, Get, UseGuards } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';
import { RolesService } from '../src/roles/roles.service';
import { RequirePermission } from '../src/auth/decorators/require-permission.decorator';
import { ModuleId } from '../src/roles/entities/module-permission.entity';

// A dummy controller to test the MatrixGuard thoroughly without relying on complex module dependencies
@Controller('test-auth')
@UseGuards(JwtAuthGuard, MatrixGuard)
class TestAuthController {
  @Get('view')
  @RequirePermission(ModuleId.CAMPUSES, 'VIEW')
  view() { return { ok: true }; }

  @Post('add')
  @RequirePermission(ModuleId.CAMPUSES, 'ADD')
  add() { return { ok: true }; }
}

describe('Authorization & RBAC (e2e)', () => {
  let app: INestApplication;

  const mockRolesService = {
    findOne: jest.fn().mockImplementation((roleId) => {
      if (roleId === 'role-teacher') {
        return Promise.resolve({
          id: 'role-teacher',
          name: 'Teacher',
          matrix: [{ moduleId: ModuleId.CAMPUSES, canView: true, canAdd: false, canEdit: false, canDelete: false }]
        });
      }
      if (roleId === 'role-admin') {
        return Promise.resolve({
          id: 'role-admin',
          name: 'Admin',
          matrix: [{ moduleId: ModuleId.CAMPUSES, canView: true, canAdd: true, canEdit: true, canDelete: true }]
        });
      }
      if (roleId === 'role-student') {
        return Promise.resolve({
          id: 'role-student',
          name: 'Student',
          matrix: [{ moduleId: ModuleId.CAMPUSES, canView: false, canAdd: false, canEdit: false, canDelete: false }]
        });
      }
      return Promise.resolve(null);
    })
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestAuthController],
      providers: [
        { provide: RolesService, useValue: mockRolesService }
      ]
    })
    .overrideProvider(RolesService)
    .useValue(mockRolesService)
    // We mock JwtAuthGuard to extract roleId from a fake header for easy testing
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (context: any) => {
        const req = context.switchToHttp().getRequest();
        const roleToken = req.headers['x-role-token'];

        if (!roleToken) return false;

        if (roleToken === 'superadmin') {
          req.user = { id: 'u1', isSuperAdmin: true };
        } else {
          req.user = { id: 'u2', isSuperAdmin: false, roleId: roleToken };
        }
        return true;
      }
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Super Admin', () => {
    it('should bypass matrix and allow ADD', () => {
      return request(app.getHttpServer())
        .post('/test-auth/add')
        .set('x-role-token', 'superadmin')
        .expect(201);
    });
  });

  describe('Admin Role', () => {
    it('should allow VIEW based on matrix', () => {
      return request(app.getHttpServer())
        .get('/test-auth/view')
        .set('x-role-token', 'role-admin')
        .expect(200);
    });

    it('should allow ADD based on matrix', () => {
      return request(app.getHttpServer())
        .post('/test-auth/add')
        .set('x-role-token', 'role-admin')
        .expect(201);
    });
  });

  describe('Teacher Role', () => {
    it('should allow VIEW based on matrix', () => {
      return request(app.getHttpServer())
        .get('/test-auth/view')
        .set('x-role-token', 'role-teacher')
        .expect(200);
    });

    it('should FORBID ADD because canAdd is false', () => {
      return request(app.getHttpServer())
        .post('/test-auth/add')
        .set('x-role-token', 'role-teacher')
        .expect(403);
    });
  });

  describe('Student Role', () => {
    it('should FORBID VIEW because canView is false', () => {
      return request(app.getHttpServer())
        .get('/test-auth/view')
        .set('x-role-token', 'role-student')
        .expect(403);
    });
  });

  describe('Unauthenticated User', () => {
    it('should reject when JwtAuthGuard fails', () => {
      return request(app.getHttpServer())
        .get('/test-auth/view')
        .expect(403);
    });
  });
});
