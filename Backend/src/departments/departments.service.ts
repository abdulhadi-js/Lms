import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
  ) {}

  async create(createDto: any, currentUser: any) {
    if (!currentUser.isSuperAdmin && currentUser.campusId !== createDto.campusId) {
      throw new ForbiddenException('Cannot create department for another campus');
    }
    const dept = this.departmentRepo.create(createDto);
    return this.departmentRepo.save(dept);
  }

  async findAll(campusId: string, currentUser: any) {
    if (!currentUser.isSuperAdmin && currentUser.campusId !== campusId) {
      throw new ForbiddenException('Cannot view departments for another campus');
    }
    return this.departmentRepo.find({
      where: { campusId },
      order: { name: 'ASC' },
      relations: { staff: true },
    });
  }

  async findOne(id: string, currentUser: any) {
    const dept = await this.departmentRepo.findOne({ where: { id }, relations: { staff: true } });
    if (!dept) throw new NotFoundException('Department not found');
    if (!currentUser.isSuperAdmin && currentUser.campusId !== dept.campusId) {
      throw new ForbiddenException('Cannot view department for another campus');
    }
    return dept;
  }

  async update(id: string, updateDto: any, currentUser: any) {
    const dept = await this.findOne(id, currentUser);
    Object.assign(dept, updateDto);
    return this.departmentRepo.save(dept);
  }

  async remove(id: string, currentUser: any) {
    const dept = await this.findOne(id, currentUser);
    await this.departmentRepo.remove(dept);
  }
}
