import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { FinanceService } from '../src/finance/finance.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('FinanceController (e2e)', () => {
  let app: INestApplication;
  
  const mockFinanceService = {
    createTransaction: jest.fn().mockResolvedValue({ id: '1', amount: 500, type: 'INCOME' }),
    getTransactions: jest.fn().mockResolvedValue([{ id: '1', amount: 500, type: 'INCOME' }]),
    getTransaction: jest.fn().mockResolvedValue({ id: '1', amount: 500, type: 'INCOME' }),
    updateTransaction: jest.fn().mockResolvedValue({ id: '1', amount: 1000, type: 'INCOME' }),
    deleteTransaction: jest.fn().mockResolvedValue(undefined),
    getPnlReport: jest.fn().mockResolvedValue({ totalIncome: 500, totalExpense: 0, netIncome: 500 }),
    generatePayroll: jest.fn().mockResolvedValue({ message: 'Payroll generated successfully' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(FinanceService)
    .useValue(mockFinanceService)
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(MatrixGuard)
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/finance/transactions (POST)', () => {
    return request(app.getHttpServer())
      .post('/finance/transactions')
      .send({ amount: 500, type: 'INCOME' })
      .expect(201)
      .expect({ id: '1', amount: 500, type: 'INCOME' });
  });

  it('/finance/transactions (GET)', () => {
    return request(app.getHttpServer())
      .get('/finance/transactions')
      .expect(200)
      .expect([{ id: '1', amount: 500, type: 'INCOME' }]);
  });

  it('/finance/transactions/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/finance/transactions/1')
      .expect(200)
      .expect({ id: '1', amount: 500, type: 'INCOME' });
  });

  it('/finance/transactions/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/finance/transactions/1')
      .send({ amount: 1000 })
      .expect(200)
      .expect({ id: '1', amount: 1000, type: 'INCOME' });
  });

  it('/finance/transactions/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/finance/transactions/1')
      .expect(200);
  });

  it('/finance/reports/pnl (GET)', () => {
    return request(app.getHttpServer())
      .get('/finance/reports/pnl?startDate=2026-08-01&endDate=2026-08-31')
      .expect(200)
      .expect({ totalIncome: 500, totalExpense: 0, netIncome: 500 });
  });

  it('/finance/payroll/generate (POST)', () => {
    return request(app.getHttpServer())
      .post('/finance/payroll/generate')
      .expect(201)
      .expect({ message: 'Payroll generated successfully' });
  });
});
