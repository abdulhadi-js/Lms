import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async logAction(
    action: string,
    entityType: string,
    entityId: string,
    reason: string,
    userId: string,
  ): Promise<AuditLog> {
    const log = this.auditLogRepository.create({
      action,
      entityType,
      entityId,
      reason,
      userId,
    });
    return this.auditLogRepository.save(log);
  }
}
