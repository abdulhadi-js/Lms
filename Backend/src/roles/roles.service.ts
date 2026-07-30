import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
  ) {}

  async create(data: any, currentUser: any): Promise<Role> {
    if (!currentUser.isSuperAdmin) {
      data.campusId = currentUser.campusId;
    }
    const role = this.repo.create(data as Role);
    return this.repo.save(role);
  }

  async findAll(currentUser: any): Promise<Role[]> {
    const qb = this.repo.createQueryBuilder('role').leftJoinAndSelect('role.matrix', 'matrix');
    if (!currentUser.isSuperAdmin) {
      qb.where('role.campusId = :campusId OR role.campusId IS NULL', { campusId: currentUser.campusId });
    }
    return qb.getMany();
  }

  async findOne(id: string, currentUser: any): Promise<Role> {
    const qb = this.repo.createQueryBuilder('role').leftJoinAndSelect('role.matrix', 'matrix').where('role.id = :id', { id });
    if (!currentUser.isSuperAdmin) {
      qb.andWhere('(role.campusId = :campusId OR role.campusId IS NULL)', { campusId: currentUser.campusId });
    }
    const role = await qb.getOne();
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: string, data: any, currentUser: any): Promise<Role> {
    const role = await this.findOne(id, currentUser);
    
    // If matrix is being updated, TypeORM cascade can sometimes append rather than replace
    // So we clear it out manually if it's explicitly passed
    if (data.matrix) {
      role.matrix = [];
      await this.repo.save(role);
    }
    
    Object.assign(role, data);
    return this.repo.save(role);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const role = await this.findOne(id, currentUser);
    await this.repo.remove(role);
  }
}
