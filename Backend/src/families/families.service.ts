import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './entities/family.entity';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private readonly familyRepo: Repository<Family>,
  ) {}

  async create(data: Partial<Family>): Promise<Family> {
    if (!data.familyCode) {
      data.familyCode = `FAM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }
    const family = this.familyRepo.create(data);
    return await this.familyRepo.save(family);
  }

  async findAll(familyCode?: string): Promise<Family[]> {
    const qb = this.familyRepo
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.users', 'users');
    if (familyCode) {
      qb.where('family.familyCode = :familyCode', { familyCode });
    }
    return await qb.getMany();
  }

  async findOne(id: string): Promise<Family> {
    const family = await this.familyRepo.findOne({
      where: { id },
      relations: { users: true },
    });
    if (!family) {
      throw new NotFoundException(`Family #${id} not found`);
    }
    return family;
  }

  async findByCode(familyCode: string): Promise<Family | null> {
    return await this.familyRepo.findOne({ where: { familyCode } });
  }
}
