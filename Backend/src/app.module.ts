import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { MarksModule } from './marks/marks.module';
import { AttendanceModule } from './attendance/attendance.module';
import { TimetableModule } from './timetable/timetable.module';
import { FeesModule } from './fees/fees.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    // Global env config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // PostgreSQL via TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST', 'localhost'),
        port: config.get<number>('POSTGRES_PORT', 5432),
        username: config.get<string>('POSTGRES_USER', 'postgres'),
        password: config.get<string>('POSTGRES_PASSWORD', 'postgres'),
        database: config.get<string>('POSTGRES_DB', 'educore_lms'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
        autoLoadEntities: true,
      }),
    }),

    // Rate limiting — 100 requests per minute per IP
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Feature modules
    AuthModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    AssignmentsModule,
    MarksModule,
    AttendanceModule,
    TimetableModule,
    FeesModule,
    ChatModule,
    NotificationsModule,
    ReportsModule,
  ],
  providers: [
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
