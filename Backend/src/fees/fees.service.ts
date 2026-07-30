import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fee, FeeStatus } from './entities/fee.entity';
import {
  CreateFeeDto,
  PayFeeDto,
  RefundFeeDto,
  BulkGenerateDto,
  DeleteFeeDto,
} from './dto/fee.dto';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Family } from '../families/entities/family.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class FeesService {
  constructor(
    @InjectRepository(Fee) private feeRepo: Repository<Fee>,
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Family) private familyRepo: Repository<Family>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateFeeDto, currentUser: any) {
    const fee = this.feeRepo.create({ ...dto, campusId: currentUser.campusId });
    return this.feeRepo.save(fee);
  }

  async findAll(currentUser: any) {
    const whereClause: any = {};
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;

    if (
      !currentUser.permissions?.includes('VIEW_FEES') &&
      !currentUser.isSuperAdmin
    ) {
      whereClause.studentId = currentUser.id;
      return this.feeRepo.find({
        where: whereClause,
        relations: { student: true, section: true },
      });
    }
    return this.feeRepo.find({
      where: whereClause,
      relations: { student: true, section: true },
    });
  }

  async findOne(id: string, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const fee = await this.feeRepo.findOne({
      where: whereClause,
      relations: { student: true, section: true },
    });
    if (!fee) throw new NotFoundException('Fee not found');
    if (
      !currentUser.permissions?.includes('VIEW_FEES') &&
      !currentUser.isSuperAdmin &&
      fee.studentId !== currentUser.id
    ) {
      throw new ForbiddenException('Cannot view other student fees');
    }
    return fee;
  }

  async pay(id: string, dto: PayFeeDto, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const fee = await this.feeRepo.findOne({ where: whereClause });
    if (!fee) throw new NotFoundException('Fee not found');
    if (
      fee.studentId !== currentUser.id &&
      !currentUser.matrix?.some(
        (m: any) => m.moduleId === 'FEES' && m.canEdit,
      ) &&
      !currentUser.isSuperAdmin
    )
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
      query.andWhere('fee.campusId = :campusId', {
        campusId: currentUser.campusId,
      });
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

    if (updateData.discount !== undefined && updateData.discount > 0) {
      if (!updateData.reason) {
        throw new BadRequestException(
          'Reason is required when applying a discount',
        );
      }
      await this.auditService.logAction(
        'APPLY_DISCOUNT',
        'Fee',
        fee.id,
        updateData.reason,
        currentUser.id,
      );
    }

    Object.assign(fee, updateData);
    return this.feeRepo.save(fee);
  }

  async remove(id: string, dto: DeleteFeeDto, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const fee = await this.feeRepo.findOne({ where: whereClause });
    if (!fee) throw new NotFoundException('Fee not found');

    if (!dto || !dto.reason) {
      throw new BadRequestException('Reason is required when deleting a fee');
    }

    await this.auditService.logAction(
      'DELETE_FEE',
      'Fee',
      fee.id,
      dto.reason,
      currentUser.id,
    );
    return this.feeRepo.remove(fee);
  }

  async bulkGenerate(dto: BulkGenerateDto, currentUser: any) {
    // Assuming courseId refers to sectionId or classId. We'll search enrollments by sectionId or section.classId
    const enrollments = await this.enrollmentRepo.find({
      where: [
        { sectionId: dto.courseId, status: 'ACTIVE' },
        { section: { classId: dto.courseId }, status: 'ACTIVE' },
      ],
      relations: { section: true },
    });

    const fees = enrollments.map((enrollment) => {
      return this.feeRepo.create({
        studentId: enrollment.studentId,
        sectionId: enrollment.sectionId,
        amount: dto.amount,
        description: dto.title,
        dueDate: new Date(dto.dueDate),
        campusId: enrollment.campusId,
        status: FeeStatus.PENDING,
      });
    });

    if (fees.length > 0) {
      await this.feeRepo.save(fees);
    }
    return { generatedCount: fees.length };
  }

  async getFamilyConsolidated(familyCode: string, currentUser: any) {
    const family = await this.familyRepo.findOne({ where: { familyCode } });
    if (!family) throw new NotFoundException('Family not found');

    const fees = await this.feeRepo
      .createQueryBuilder('fee')
      .leftJoinAndSelect('fee.student', 'student')
      .where('student.familyId = :familyId', { familyId: family.id })
      .andWhere('fee.status IN (:...statuses)', {
        statuses: [FeeStatus.PENDING, FeeStatus.OVERDUE],
      })
      .getMany();

    let totalAmount = 0;
    let totalDiscount = 0;
    let totalLateFee = 0;
    let totalPaid = 0;

    for (const fee of fees) {
      totalAmount += fee.amount;
      totalDiscount += Number(fee.discount || 0);
      totalLateFee += Number(fee.lateFee || 0);
      totalPaid += fee.paidAmount;
    }

    const netPayable = totalAmount + totalLateFee - totalDiscount - totalPaid;

    return {
      familyCode,
      totalUnpaidFees: fees.length,
      fees,
      summary: {
        totalAmount,
        totalDiscount,
        totalLateFee,
        totalPaid,
        netPayable,
      },
    };
  }

  async applyMeritDiscount(studentId: string, percentage: number) {
    const fee = await this.feeRepo.findOne({
      where: { studentId, status: FeeStatus.PENDING },
      order: { createdAt: 'ASC' },
    });

    if (!fee)
      throw new NotFoundException('No pending fee found for the student');

    const discountAmount = fee.amount * (percentage / 100);
    fee.discount = Number(fee.discount || 0) + discountAmount;

    // Using a system user ID or keeping it empty if done by system
    await this.auditService.logAction(
      'MERIT_DISCOUNT',
      'Fee',
      fee.id,
      `Merit discount of ${percentage}% applied`,
      'SYSTEM',
    );
    return this.feeRepo.save(fee);
  }
}
