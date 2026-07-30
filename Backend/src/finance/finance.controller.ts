import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';

@Controller('finance')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @RequirePermission(ModuleId.ACCOUNTS, 'ADD')
  @Post('transactions')
  createTransaction(@Body() dto: CreateTransactionDto) {
    return this.financeService.createTransaction(dto);
  }

  @RequirePermission(ModuleId.ACCOUNTS, 'VIEW')
  @Get('transactions')
  getTransactions() {
    return this.financeService.getTransactions();
  }

  @RequirePermission(ModuleId.ACCOUNTS, 'VIEW')
  @Get('transactions/:id')
  getTransaction(@Param('id') id: string) {
    return this.financeService.getTransaction(id);
  }

  @RequirePermission(ModuleId.ACCOUNTS, 'EDIT')
  @Put('transactions/:id')
  updateTransaction(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.financeService.updateTransaction(id, dto);
  }

  @RequirePermission(ModuleId.ACCOUNTS, 'DELETE')
  @Delete('transactions/:id')
  deleteTransaction(@Param('id') id: string) {
    return this.financeService.deleteTransaction(id);
  }

  @RequirePermission(ModuleId.ACCOUNTS, 'VIEW')
  @Get('reports/pnl')
  getPnlReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.financeService.getPnlReport(startDate, endDate);
  }

  @RequirePermission(ModuleId.ACCOUNTS, 'ADD')
  @Post('payroll/generate')
  generatePayroll() {
    return this.financeService.generatePayroll();
  }
}
