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

  async create(dto: CreateFeeDto, currentUser: any) {
    const fee = this.feeRepo.create({ ...dto, campusId: currentUser.campusId });
    return this.feeRepo.save(fee);
  }

  async findAll(currentUser: any) {
    const whereClause: any = {};
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    
    if (!currentUser.permissions?.includes('VIEW_FEES') && !currentUser.isSuperAdmin) {
      whereClause.studentId = currentUser.id;
      return this.feeRepo.find({ where: whereClause, relations: { student: true, section: true } });
    }
    return this.feeRepo.find({ where: whereClause, relations: { student: true, section: true } });
  }

  async findOne(id: string, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const fee = await this.feeRepo.findOne({ where: whereClause, relations: { student: true, section: true } });
    if (!fee) throw new NotFoundException('Fee not found');
    if (!currentUser.permissions?.includes('VIEW_FEES') && !currentUser.isSuperAdmin && fee.studentId !== currentUser.id) {
      throw new ForbiddenException('Cannot view other student fees');
    }
    return fee;
  }

  async pay(id: string, dto: PayFeeDto, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const fee = await this.feeRepo.findOne({ where: whereClause });
    if (!fee) throw new NotFoundException('Fee not found');
    if (fee.studentId !== currentUser.id && !currentUser.permissions?.includes('MANAGE_FEES') && !currentUser.isSuperAdmin)
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

  async refund(id: string, dto: RefundFeeDto, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const fee = await this.feeRepo.findOne({ where: whereClause });
    if (!fee) throw new NotFoundException('Fee not found');

    fee.status = FeeStatus.REFUNDED;
    fee.refundReason = dto.refundReason;
    return this.feeRepo.save(fee);
  }

  async getOutstandingFees(studentId: string | undefined, currentUser: any) {
    const query = this.feeRepo
      .createQueryBuilder('fee')
      .where('fee.status IN (:...statuses)', {
        statuses: [FeeStatus.PENDING, FeeStatus.OVERDUE],
      })
      .leftJoinAndSelect('fee.student', 'student')
      .leftJoinAndSelect('fee.section', 'section');

    if (!currentUser.isSuperAdmin) {
      query.andWhere('fee.campusId = :campusId', { campusId: currentUser.campusId });
    }

    if (studentId) {
      query.andWhere('fee.studentId = :studentId', { studentId });
    }
    return query.getMany();
  }

  async update(id: string, updateData: any, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const fee = await this.feeRepo.findOne({ where: whereClause });
    if (!fee) throw new NotFoundException('Fee not found');
    Object.assign(fee, updateData);
    return this.feeRepo.save(fee);
  }

  async remove(id: string, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const fee = await this.feeRepo.findOne({ where: whereClause });
    if (!fee) throw new NotFoundException('Fee not found');
    return this.feeRepo.remove(fee);
  }
}
