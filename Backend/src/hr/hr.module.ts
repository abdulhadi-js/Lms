import { RolesModule } from '../roles/roles.module';
import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffProfile } from './entities/staff-profile.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [RolesModule, TypeOrmModule.forFeature([StaffProfile, User])],
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}
