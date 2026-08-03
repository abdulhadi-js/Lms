import { RolesModule } from '../roles/roles.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampusesService } from './campuses.service';
import { CampusesController, PublicCampusesController } from './campuses.controller';
import { Campus } from './entities/campus.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RolesModule, TypeOrmModule.forFeature([Campus]), AuthModule],
  providers: [CampusesService],
  controllers: [CampusesController, PublicCampusesController],
  exports: [CampusesService, TypeOrmModule],
})
export class CampusesModule {}
