import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { Role } from './common/enums/roles.enum';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  
  try {
    console.log('Seeding ADMIN user...');
    await usersService.create({
      email: 'admin@educore.com',
      password: 'Admin@123!',
      role: Role.ADMIN,
      firstName: 'Admin',
      lastName: 'User',
    } as any);

    console.log('Seeding TEACHER user...');
    await usersService.create({
      email: 'teacher@educore.com',
      password: 'Teacher@123!',
      role: Role.INSTRUCTOR,
      firstName: 'John',
      lastName: 'Smith',
    } as any);

    console.log('Seeding STUDENT user...');
    await usersService.create({
      email: 'student@educore.com',
      password: 'Student@123!',
      role: Role.STUDENT,
      firstName: 'Jane',
      lastName: 'Doe',
    } as any);

    console.log('✅ Seed complete!');
  } catch (error) {
    console.error('Error during seeding (maybe users already exist?):', error.message);
  } finally {
    await app.close();
  }
}

seed();
