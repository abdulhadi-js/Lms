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

  async create(data: any): Promise<Role> {
    const role = this.repo.create(data as Role);
    return this.repo.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.repo.findOne({ where: { id }, relations: ['matrix'] });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: string, data: any): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, data);
    return this.repo.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.repo.remove(role);
  }
}
