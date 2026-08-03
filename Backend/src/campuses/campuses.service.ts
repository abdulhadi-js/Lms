import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campus } from './entities/campus.entity';

@Injectable()
export class CampusesService {
  constructor(
    @InjectRepository(Campus)
    private readonly repo: Repository<Campus>,
  ) {}

  async create(data: any, currentUser: any): Promise<Campus> {
    if (!currentUser.isSuperAdmin) {
      throw new ForbiddenException('Only SuperAdmin can create a campus');
    }
    const campus = this.repo.create(data as Campus);
    return this.repo.save(campus);
  }

  async findAll(currentUser: any): Promise<Campus[]> {
    if (!currentUser.isSuperAdmin) {
      return this.repo.find({ where: { id: currentUser.campusId } });
    }
    return this.repo.find();
  }

  async findOne(id: string, currentUser: any): Promise<Campus> {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) {
      whereClause.id = currentUser.campusId;
      if (id !== currentUser.campusId) throw new ForbiddenException('Access denied to other campuses');
    }
    const campus = await this.repo.findOne({ where: whereClause });
    if (!campus) throw new NotFoundException('Campus not found');
    return campus;
  }

  async update(id: string, data: any, currentUser: any): Promise<Campus> {
    const campus = await this.findOne(id, currentUser);
    Object.assign(campus, data);
    return this.repo.save(campus);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    if (!currentUser.isSuperAdmin) throw new ForbiddenException('Only SuperAdmin can delete a campus');
    const campus = await this.findOne(id, currentUser);
    await this.repo.remove(campus);
  }
}
