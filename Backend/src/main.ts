import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import {
  ValidationPipe,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof Error ? exception.message : 'Unknown error';
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      console.error('Validation Error Details:', exceptionResponse);
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        message = (exceptionResponse as any).message;
      }
    }

    const isProd = process.env.NODE_ENV === 'production';
    response.status(status).json({
      statusCode: status,
      message,
      // WARN-04: Never expose stack traces in production
      ...(isProd
        ? {}
        : { stack: exception instanceof Error ? exception.stack : undefined }),
    });
  }
}

import { DataSource } from 'typeorm';
import { RolesService } from './roles/roles.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enforce system roles alignment with V2 PRD on startup
  const dataSource = app.get(DataSource);
  await dataSource.query(
    `UPDATE roles SET "isSystem" = true, "campusId" = null WHERE name IN ('Principal', 'Teacher', 'Student')`
  ).catch(e => console.log('Notice: Could not enforce system roles:', e.message));

  // Enforce PRD matrices on live roles
  try {
    const rolesService = app.get(RolesService);
    const repo = dataSource.getRepository('Role');
    
    const student = await repo.findOne({ where: { name: 'Student' } });
    if (student) {
      await rolesService.update(student.id, {
        matrix: [
          { moduleId: 'ACADEMICS', canView: true, canAdd: false, canEdit: false, canDelete: false },
          { moduleId: 'EXAMS', canView: true, canAdd: false, canEdit: false, canDelete: false },
          { moduleId: 'FEES', canView: true, canAdd: false, canEdit: false, canDelete: false },
        ]
      });
    }

    const teacher = await repo.findOne({ where: { name: 'Teacher' } });
    if (teacher) {
      await rolesService.update(teacher.id, {
        matrix: [
          { moduleId: 'ACADEMICS', canView: true, canAdd: false, canEdit: false, canDelete: false },
          { moduleId: 'EXAMS', canView: true, canAdd: true, canEdit: true, canDelete: false },
          { moduleId: 'ATTENDANCE', canView: true, canAdd: true, canEdit: true, canDelete: false },
        ]
      });
    }

    const principal = await repo.findOne({ where: { name: 'Principal' } });
    if (principal) {
      await rolesService.update(principal.id, {
        matrix: [
          { moduleId: 'USERS_STAFF', canView: true, canAdd: true, canEdit: true, canDelete: true },
          { moduleId: 'ROLES', canView: true, canAdd: true, canEdit: true, canDelete: true },
          { moduleId: 'ACADEMICS', canView: true, canAdd: true, canEdit: true, canDelete: true },
          { moduleId: 'FEES', canView: true, canAdd: false, canEdit: false, canDelete: false },
          { moduleId: 'REPORTS', canView: true, canAdd: false, canEdit: false, canDelete: false },
        ]
      });
    }
  } catch (e) {
    console.log('Notice: Could not enforce system role matrices:', e.message);
  }

  const configService = app.get(ConfigService);

  // Serve static uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Apply helmet for secure HTTP headers
  const helmet = await import('helmet');
  app.use(helmet.default());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true, // auto-transform to DTO types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Apply Global Exception Filter to see what is crashing
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS — Allow dynamic origin reflection so Vercel can talk to Render effortlessly
  app.enableCors({
    origin: true,
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

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port, '0.0.0.0');

  console.log(
    `\n🚀 EduCore LMS API running on: http://localhost:${port}/api/v1`,
  );
  console.log(
    `📖 Swagger Docs available at: http://localhost:${port}/api/docs\n`,
  );
}

bootstrap();
