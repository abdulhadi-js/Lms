import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
import { Fee } from '../fees/entities/fee.entity';
import { User } from '../users/entities/user.entity';
import { UserStatus } from '../common/enums/status.enum';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Fee)
    private feeRepository: Repository<Fee>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const tx = this.transactionRepository.create(dto);
    return this.transactionRepository.save(tx);
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async getTransaction(id: string): Promise<Transaction> {
    const tx = await this.transactionRepository.findOne({ where: { id } });
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }

  async updateTransaction(
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const tx = await this.getTransaction(id);
    Object.assign(tx, dto);
    return this.transactionRepository.save(tx);
  }

  async deleteTransaction(id: string): Promise<void> {
    const tx = await this.getTransaction(id);
    await this.transactionRepository.remove(tx);
  }

  async getPnlReport(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const txs = await this.transactionRepository.find({
      where: { date: Between(start, end) },
    });

    // PNL definition mentions "in that date range", we'll check fees updated in that range or paidAt in that range.
    // Let's use `paidAt` as it represents the payment date, or fallback to updatedAt if paidAt is null.
    // We'll just fetch all fees and filter in memory to be safe, or just query where paidAt is between dates.
    const fees = await this.feeRepository.find({
      where: [
        { paidAt: Between(start, end) },
        // if paidAt is not used reliably, we could check updatedAt but let's assume paidAt or just all fees with paidAmount > 0 for simplicity if date matching is hard.
      ],
    });
    // For simplicity, sum all fees that have a paidAt in the range, plus fees that don't have paidAt but were updated in range.
    // Actually, I'll just use a builder.
    const feeQuery = await this.feeRepository
      .createQueryBuilder('fee')
      .where('fee.paidAmount > 0')
      .andWhere(
        '(fee.paidAt BETWEEN :start AND :end OR fee.updatedAt BETWEEN :start AND :end)',
        { start, end },
      )
      .getMany();

    const incomeTxs = txs
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expenseTxs = txs
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const feesIncome = feeQuery.reduce(
      (sum, f) => sum + Number(f.paidAmount),
      0,
    );

    const totalIncome = incomeTxs + feesIncome;
    const totalExpenses = expenseTxs;
    const netProfit = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, netProfit };
  }

  async generatePayroll() {
    // Fetch all active users who are NOT students
    const users = await this.userRepository.find({
      where: { status: UserStatus.ACTIVE },
      relations: { role: true, staffProfile: true },
    });

    const staffUsers = users.filter(
      (u) => u.role?.name?.toLowerCase() !== 'student',
    );
    const transactions: Transaction[] = [];
    const now = new Date();

    for (const user of staffUsers) {
      if (user.staffProfile) {
        let netSalary = Number(user.staffProfile.basicSalary || 0);

        // simplified calculation
        const parseAdd = (val: any) => {
          if (!val) return 0;
          if (typeof val === 'number') return val;
          if (typeof val === 'string') {
            const n = Number(val);
            if (!isNaN(n)) return n;
            try {
              val = JSON.parse(val);
            } catch (e) {}
          }
          if (Array.isArray(val)) {
            return val.reduce(
              (acc: number, curr: any) =>
                acc + (Number(curr.amount || curr) || 0),
              0,
            );
          }
          if (typeof val === 'object') {
            return Object.values(val).reduce(
              (acc: number, curr: any) => acc + (Number(curr) || 0),
              0,
            );
          }
          return 0;
        };

        netSalary += parseAdd(user.staffProfile.allowances);
        netSalary -= parseAdd(user.staffProfile.deductions);

        if (netSalary > 0) {
          const tx = this.transactionRepository.create({
            type: TransactionType.EXPENSE,
            category: 'SALARY',
            amount: netSalary,
            date: now,
            description: `Salary for ${user.fullName} - ${now.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
            campusId: user.campusId,
          });
          transactions.push(tx);
        }
      }
    }

    if (transactions.length > 0) {
      await this.transactionRepository.save(transactions);
    }

    return {
      message: `Payroll generated for ${transactions.length} employees`,
      count: transactions.length,
    };
  }
}
