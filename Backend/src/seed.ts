import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { CampusesService } from './campuses/campuses.service';
import { RolesService } from './roles/roles.service';
import { ModuleId } from './roles/entities/module-permission.entity';
import { DepartmentsService } from './departments/departments.service';
import { AcademicGroupsService } from './academic-groups/academic-groups.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const campusesService = app.get(CampusesService);
  const rolesService = app.get(RolesService);
  const departmentsService = app.get(DepartmentsService);
  const academicGroupsService = app.get(AcademicGroupsService);

  const superAdminUser = { isSuperAdmin: true };

  try {
    console.log('Seeding SUPER ADMIN user...');
    try {
      await usersService.create({
        email: 'superadmin@educore.com',
        password: 'Admin@123!',
        isSuperAdmin: true,
        firstName: 'Super',
        lastName: 'Admin',
      } as any, superAdminUser);
      console.log('✅ Super Admin seed complete!');
    } catch (e) {
      console.log('Super Admin already exists or error:', e.message);
    }

    console.log('\nCreating Default Campus...');
    let campus;
    try {
      campus = await campusesService.create({
        name: 'Main Campus',
        code: 'MAIN-01',
        address: '123 EduCore Street',
        contactPhone: '1234567890',
      }, superAdminUser);
      console.log('✅ Campus created:', campus.name);
    } catch (e) {
      console.log('Campus may already exist, fetching it...');
      const allCampuses = await campusesService.findAll(superAdminUser);
      campus = allCampuses[0]; // Just grab the first one
    }

    if (!campus) throw new Error('No campus available to assign roles');

    console.log('\nCreating Departments & Academic Groups...');
    try {
      await departmentsService.create({ name: 'Science Department', campusId: campus.id }, superAdminUser);
      await departmentsService.create({ name: 'Arts Department', campusId: campus.id }, superAdminUser);
      await academicGroupsService.create({ name: 'Pre-Medical', campusId: campus.id }, superAdminUser);
      await academicGroupsService.create({ name: 'Computer Science', campusId: campus.id }, superAdminUser);
      console.log('✅ Departments & Academic Groups created!');
    } catch (e) {
      console.log('Departments/Groups already exist or error:', e.message);
    }

    console.log('\nCreating Roles and Users...');

    // 1. Principal / Campus Admin
    const principalRole = await rolesService.create({
      name: 'Principal',
      campusId: null,
      isSystem: true,
      matrix: [
        {
          moduleId: ModuleId.USERS_STAFF,
          canView: true,
          canAdd: true,
          canEdit: true,
          canDelete: true,
        },
        {
          moduleId: ModuleId.ROLES,
          canView: true,
          canAdd: true,
          canEdit: true,
          canDelete: true,
        },
        {
          moduleId: ModuleId.ACADEMICS,
          canView: true,
          canAdd: true,
          canEdit: true,
          canDelete: true,
        },
        {
          moduleId: ModuleId.FEES,
          canView: true,
          canAdd: false,
          canEdit: false,
          canDelete: false,
        },
        {
          moduleId: ModuleId.REPORTS,
          canView: true,
          canAdd: false,
          canEdit: false,
          canDelete: false,
        },
      ],
    }, superAdminUser);
    await usersService
      .create({
        email: 'principal@educore.com',
        password: 'Principal@123!',
        firstName: 'Principal',
        lastName: 'Skinner',
        roleId: principalRole.id,
        campusId: campus.id,
      } as any, superAdminUser)
      .catch(() => console.log('Principal user already exists'));

    // 2. Teacher
    const teacherRole = await rolesService.create({
      name: 'Teacher',
      campusId: null,
      isSystem: true,
      matrix: [
        {
          moduleId: ModuleId.ACADEMICS,
          canView: true,
          canAdd: false,
          canEdit: false,
          canDelete: false,
        },
        {
          moduleId: ModuleId.EXAMS,
          canView: true,
          canAdd: true,
          canEdit: true,
          canDelete: false,
        },
        {
          moduleId: ModuleId.ATTENDANCE,
          canView: true,
          canAdd: true,
          canEdit: true,
          canDelete: false,
        },
      ],
    }, superAdminUser);
    await usersService
      .create({
        email: 'teacher@educore.com',
        password: 'Teacher@123!',
        firstName: 'John',
        lastName: 'Smith',
        roleId: teacherRole.id,
        campusId: campus.id,
      } as any, superAdminUser)
      .catch(() => console.log('Teacher user already exists'));

    // 3. Student
    const studentRole = await rolesService.create({
      name: 'Student',
      campusId: null,
      isSystem: true,
      matrix: [
        {
          moduleId: ModuleId.ACADEMICS,
          canView: true,
          canAdd: false,
          canEdit: false,
          canDelete: false,
        },
        {
          moduleId: ModuleId.EXAMS,
          canView: true,
          canAdd: false,
          canEdit: false,
          canDelete: false,
        },
        {
          moduleId: ModuleId.FEES,
          canView: true,
          canAdd: false,
          canEdit: false,
          canDelete: false,
        },
      ],
    }, superAdminUser);
    await usersService
      .create({
        email: 'student@educore.com',
        password: 'Student@123!',
        firstName: 'Jane',
        lastName: 'Doe',
        roleId: studentRole.id,
        campusId: campus.id,
      } as any, superAdminUser)
      .catch(() => console.log('Student user already exists'));

    console.log('\n✅ All roles and standard test users created!');
  } catch (error) {
    console.error('Error during seeding:', error.message);
  } finally {
    await app.close();
  }
}

seed();
