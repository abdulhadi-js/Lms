import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Apply helmet for secure HTTP headers
  const helmet = await import('helmet');
  app.use(helmet.default());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,        // auto-transform to DTO types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Swagger API Docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('EduCore LMS API')
    .setDescription(
      'Production-level REST API for the EduCore Learning Management System. ' +
      'Supports Admin, Teacher, and Student roles with full RBAC.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management (Admin only)')
    .addTag('Courses', 'Course & curriculum management')
    .addTag('Enrollments', 'Enrollment & admissions')
    .addTag('Assignments', 'Assignments & submissions')
    .addTag('Marks', 'Marks entry, gradebook & transcripts')
    .addTag('Attendance', 'Attendance tracking')
    .addTag('Timetable', 'Institution-wide scheduling')
    .addTag('Fees', 'Fee structure & payments')
    .addTag('Chat', 'Messaging (REST + WebSocket)')
    .addTag('Notifications', 'Announcements & alerts')
    .addTag('Reports', 'Analytics & reporting')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('APP_PORT', 3001);
  await app.listen(port);

  console.log(`\n🚀 EduCore LMS API running on: http://localhost:${port}/api/v1`);
  console.log(`📖 Swagger Docs available at: http://localhost:${port}/api/docs\n`);
}

bootstrap();
