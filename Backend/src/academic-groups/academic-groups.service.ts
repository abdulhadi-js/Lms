import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicGroup } from './entities/academic-group.entity';

@Injectable()
export class AcademicGroupsService {
  constructor(
    @InjectRepository(AcademicGroup)
    private groupRepo: Repository<AcademicGroup>,
  ) {}

  async create(createDto: any, currentUser: any) {
    if (!currentUser.isSuperAdmin && currentUser.campusId !== createDto.campusId) {
      throw new ForbiddenException('Cannot create academic group for another campus');
    }
    const group = this.groupRepo.create(createDto);
    return this.groupRepo.save(group);
  }

  async findAll(campusId: string, currentUser: any) {
    if (!currentUser.isSuperAdmin && currentUser.campusId !== campusId) {
      throw new ForbiddenException('Cannot view academic groups for another campus');
    }
    return this.groupRepo.find({
      where: { campusId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, currentUser: any) {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Academic Group not found');
    if (!currentUser.isSuperAdmin && currentUser.campusId !== group.campusId) {
      throw new ForbiddenException('Cannot view academic group for another campus');
    }
    return group;
  }

  async update(id: string, updateDto: any, currentUser: any) {
    const group = await this.findOne(id, currentUser);
    Object.assign(group, updateDto);
    return this.groupRepo.save(group);
  }

  async remove(id: string, currentUser: any) {
    const group = await this.findOne(id, currentUser);
    await this.groupRepo.remove(group);
  }
}
