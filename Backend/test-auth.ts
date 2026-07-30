import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AuthService } from './src/auth/auth.service';

async function test() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  
  try {
    const user = await authService.validateUser('superadmin@educore.com', 'Admin@123!');
    console.log('Login successful:', user.email);
  } catch (err) {
    console.error('Login failed:', err.message);
  }
  
  await app.close();
}

test();
