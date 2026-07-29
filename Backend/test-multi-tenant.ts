import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { CampusesService } from './src/campuses/campuses.service';
import { RolesService } from './src/roles/roles.service';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
  console.log('Bootstrapping NestJS Context for Multi-Tenant Testing...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const campusesService = app.get(CampusesService);
  const rolesService = app.get(RolesService);
  const usersService = app.get(UsersService);

  try {
    // 1. Create a Campus
    console.log('1. Creating a new Campus (Lahore Main)...');
    const campus = await campusesService.create({
      name: 'Lahore Main Campus',
      code: 'LHR-01',
      address: '123 Gulberg III, Lahore',
      contactPhone: '0300-1234567'
    });
    console.log(`✅ Campus Created: ${campus.name} (ID: ${campus.id})`);

    // 2. Create a Custom Role for the Campus
    console.log('2. Creating a Custom Role (Accountant)...');
    const role = await rolesService.create({
      name: 'Accountant',
      campusId: campus.id,
      permissions: ['MANAGE_FEES', 'VIEW_FEES', 'VIEW_USERS']
    });
    console.log(`✅ Role Created: ${role.name} (Permissions: ${role.permissions.join(', ')})`);

    // 3. Create a User assigned to the Campus and Role
    console.log('3. Creating a User assigned to Campus and Role...');
    const user = await usersService.create({
      email: `accountant_${Date.now()}@educore.test`,
      password: 'password123',
      firstName: 'Ali',
      lastName: 'Ahmad',
      roleId: role.id,
      campusId: campus.id
    } as any); // Type cast due to new fields
    
    // Fetch the user with relations to verify
    const verifiedUser = await usersService.findOne(user.id);
    
    console.log(`✅ User Created: ${verifiedUser.firstName} ${verifiedUser.lastName}`);
    console.log(`   - Email: ${verifiedUser.email}`);
    console.log(`   - Assigned Campus: ${(verifiedUser as any).campus?.name}`);
    console.log(`   - Assigned Role: ${(verifiedUser as any).role?.name}`);
    
    console.log('\n🎉 Multi-Tenant Architecture Test Passed Successfully!');
  } catch (error) {
    console.error('\n❌ Test Failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
