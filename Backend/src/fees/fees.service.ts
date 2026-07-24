import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fee, FeeStatus } from './entities/fee.entity';
import { CreateFeeDto, PayFeeDto, RefundFeeDto } from './dto/fee.dto';

@Injectable()
export class FeesService {
  constructor(@InjectRepository(Fee) private feeRepo: Repository<Fee>) {}

  async create(dto: CreateFeeDto) {
    const fee = this.feeRepo.create(dto);
    return this.feeRepo.save(fee);
  }

  async findAll(currentUser: any) {
    if (currentUser.role === 'STUDENT') {
      return this.feeRepo.find({ where: { studentId: currentUser.id } });
    }
    return this.feeRepo.find();
  }

  async findOne(id: string, currentUser: any) {
    const fee = await this.feeRepo.findOne({ where: { id } });
    if (!fee) throw new NotFoundException('Fee not found');
    if (currentUser.role === 'STUDENT' && fee.studentId !== currentUser.id) {
      throw new ForbiddenException('Cannot view other student fees');
    }
    return fee;
  }

  async pay(id: string, dto: PayFeeDto, studentId: string) {
    const fee = await this.feeRepo.findOne({ where: { id } });
    if (!fee) throw new NotFoundException('Fee not found');
    if (fee.studentId !== studentId)
      throw new ForbiddenException('Not your fee');
    if (fee.status === FeeStatus.PAID)
      throw new BadRequestException('Fee already paid');

    fee.paidAmount += dto.paidAmount;
    if (fee.paidAmount >= fee.amount) {
      fee.status = FeeStatus.PAID;
      fee.paidAt = new Date();
    }
    return this.feeRepo.save(fee);
  }

  async refund(id: string, dto: RefundFeeDto, adminId: string) {
    const fee = await this.feeRepo.findOne({ where: { id } });
    if (!fee) throw new NotFoundException('Fee not found');

    fee.status = FeeStatus.REFUNDED;
    fee.refundReason = dto.refundReason;
    return this.feeRepo.save(fee);
  }

  async getOutstandingFees(studentId?: string) {
    const query = this.feeRepo
      .createQueryBuilder('fee')
      .where('fee.status IN (:...statuses)', {
        statuses: [FeeStatus.PENDING, FeeStatus.OVERDUE],
      });

    if (studentId) {
      query.andWhere('fee.studentId = :studentId', { studentId });
    }
    return query.getMany();
  }

  async update(id: string, updateData: any) {
    const fee = await this.feeRepo.findOne({ where: { id } });
    if (!fee) throw new NotFoundException('Fee not found');
    Object.assign(fee, updateData);
    return this.feeRepo.save(fee);
  }

  async remove(id: string) {
    const fee = await this.feeRepo.findOne({ where: { id } });
    if (!fee) throw new NotFoundException('Fee not found');
    return this.feeRepo.remove(fee);
  }
}
