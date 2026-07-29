import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timetable } from './entities/timetable.entity';
import { CreateTimetableDto } from './dto/create-timetable.dto';

@Injectable()
export class TimetableService {
  constructor(
    @InjectRepository(Timetable) private timetableRepo: Repository<Timetable>,
  ) {}

  async create(dto: CreateTimetableDto, currentUser: any) {
    const conflict = await this.timetableRepo.findOne({
      where: {
        room: dto.room,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        campusId: currentUser.isSuperAdmin ? undefined : currentUser.campusId
      },
    });
    if (conflict) {
      throw new ConflictException('Room is already booked at this time');
    }
    const entry = this.timetableRepo.create({ ...dto, campusId: currentUser.campusId });
    return this.timetableRepo.save(entry);
  }

  async findAll(currentUser: any) {
    if (!currentUser.permissions?.includes('VIEW_TIMETABLE') && !currentUser.isSuperAdmin) {
      // Assume student
      const query = this.timetableRepo
        .createQueryBuilder('t')
        .innerJoinAndSelect('t.section', 'sec')
        .innerJoinAndSelect('t.subject', 'sub')
        .innerJoin('enrollments', 'e', 'e.sectionId = t.sectionId AND e.studentId = :sid AND e.status = :status', {
          sid: currentUser.id,
          status: 'ACTIVE'
        })
        .leftJoinAndSelect('t.teacher', 'teacher');
        
      if (!currentUser.isSuperAdmin) query.andWhere('t.campusId = :campusId', { campusId: currentUser.campusId });
      return query.getMany();
    }
    
    const whereClause: any = {};
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    
    // If not super admin, teacher might only see their own sections in a perfect world, 
    // but for now, everyone with VIEW_TIMETABLE can see the campus timetable
    return this.timetableRepo.find({ where: whereClause, relations: { section: true, subject: true, teacher: true } });
  }

  async update(id: string, dto: Partial<CreateTimetableDto>, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const entry = await this.timetableRepo.findOne({ where: whereClause });
    if (!entry) throw new NotFoundException('Timetable entry not found');
    Object.assign(entry, dto);
    return this.timetableRepo.save(entry);
  }

  async remove(id: string, currentUser: any) {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const entry = await this.timetableRepo.findOne({ where: whereClause });
    if (!entry) throw new NotFoundException('Timetable entry not found');

    const result = await this.timetableRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Timetable entry not found');
    return { success: true };
  }
}
