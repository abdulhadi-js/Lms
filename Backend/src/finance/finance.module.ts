import { RolesModule } from '../roles/roles.module';
import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Fee } from '../fees/entities/fee.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [RolesModule, TypeOrmModule.forFeature([Transaction, Fee, User])],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
