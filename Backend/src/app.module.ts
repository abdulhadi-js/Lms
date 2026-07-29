import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


import { getDatabaseConfig } from './config/database.config';
import { CloudinaryModule } from './config/cloudinary.module';
import { MailModule } from './mail/mail.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AcademicsModule } from './academics/academics.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { MarksModule } from './marks/marks.module';
import { AttendanceModule } from './attendance/attendance.module';
import { TimetableModule } from './timetable/timetable.module';
import { FeesModule } from './fees/fees.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { RolesModule } from './roles/roles.module';
import { CampusesModule } from './campuses/campuses.module';

@Module({
  imports: [
    // ── Global env config ────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ── PostgreSQL via TypeORM (Neon cloud, with SSL) ──────────────────────
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => getDatabaseConfig(config),
    }),

    // ── Rate limiting — 100 requests per minute per IP ────────────────────
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // ── Global infrastructure modules ─────────────────────────────────────

    CloudinaryModule,  // BUG-03 fix: global file upload service
    MailModule,        // BUG-03 fix: global email service

    // ── Feature modules ───────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    AcademicsModule,
    EnrollmentsModule,
    AssignmentsModule,
    MarksModule,
    AttendanceModule,
    TimetableModule,
    FeesModule,
    ChatModule,
    NotificationsModule,
    ReportsModule,
    RolesModule,
    CampusesModule,
  ],
  providers: [
    // Apply rate limiting globally
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
