import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timetable } from './entities/timetable.entity';
import { CreateTimetableDto } from './dto/create-timetable.dto';

@Injectable()
export class TimetableService {
  constructor(
    @InjectRepository(Timetable) private timetableRepo: Repository<Timetable>,
  ) {}

  async create(dto: CreateTimetableDto) {
    const conflict = await this.timetableRepo.findOne({
      where: {
        room: dto.room,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime, // Simplified conflict check
      }
    });
    if (conflict) {
      throw new ConflictException('Room is already booked at this time');
    }
    const entry = this.timetableRepo.create(dto);
    return this.timetableRepo.save(entry);
  }

  async findAll(currentUser: any) {
    // Basic implementation. In reality, filter by student's enrollments or teacher's courses
    return this.timetableRepo.find();
  }

  async update(id: string, dto: Partial<CreateTimetableDto>) {
    const entry = await this.timetableRepo.findOne({ where: { id } });
    if (!entry) throw new NotFoundException('Timetable entry not found');
    Object.assign(entry, dto);
    return this.timetableRepo.save(entry);
  }

  async remove(id: string) {
    const result = await this.timetableRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Timetable entry not found');
    return { success: true };
  }
}
