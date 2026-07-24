import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController, ApplicationsController } from './enrollments.controller';
import { Enrollment } from './entities/enrollment.entity';
import { Application } from './entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Application])],
  controllers: [EnrollmentsController, ApplicationsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
