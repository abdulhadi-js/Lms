import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';
import { Role } from './src/users/enums/user.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    await usersService.findByEmail('admin@educore.com');
    console.log('Admin already exists.');
  } catch (err) {
    await usersService.create({
      email: 'admin@educore.com',
      password: 'Admin@123',
      role: Role.ADMIN,
      firstName: 'System',
      lastName: 'Admin',
    });
    console.log('Admin user created successfully!');
  }

  await app.close();
}
bootstrap();
