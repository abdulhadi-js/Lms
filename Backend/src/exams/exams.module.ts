import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';

import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [ExamsController],
  providers: [ExamsService]
})
export class ExamsModule {}
