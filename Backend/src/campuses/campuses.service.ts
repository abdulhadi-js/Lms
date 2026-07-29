import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campus } from './entities/campus.entity';

@Injectable()
export class CampusesService {
  constructor(
    @InjectRepository(Campus)
    private readonly repo: Repository<Campus>,
  ) {}

  async create(data: any): Promise<Campus> {
    const campus = this.repo.create(data as Campus);
    return this.repo.save(campus);
  }

  async findAll(): Promise<Campus[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Campus> {
    const campus = await this.repo.findOne({ where: { id } });
    if (!campus) throw new NotFoundException('Campus not found');
    return campus;
  }

  async update(id: string, data: any): Promise<Campus> {
    const campus = await this.findOne(id);
    Object.assign(campus, data);
    return this.repo.save(campus);
  }

  async remove(id: string): Promise<void> {
    const campus = await this.findOne(id);
    await this.repo.remove(campus);
  }
}
