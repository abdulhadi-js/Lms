import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicClass } from './entities/academic-class.entity';
import { Section } from './entities/section.entity';
import { Subject } from './entities/subject.entity';
import { TeacherAssignment } from './entities/teacher-assignment.entity';
import {
  CreateAcademicClassDto,
  UpdateAcademicClassDto,
  CreateSectionDto,
  UpdateSectionDto,
  CreateSubjectDto,
  UpdateSubjectDto,
  AssignTeacherDto,
} from './dto/academics.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AcademicsService {
  constructor(
    @InjectRepository(AcademicClass)
    private academicClassRepo: Repository<AcademicClass>,
    @InjectRepository(Section)
    private sectionRepo: Repository<Section>,
    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,
    @InjectRepository(TeacherAssignment)
    private teacherAssignmentRepo: Repository<TeacherAssignment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // --- Classes ---
  async createClass(
    dto: CreateAcademicClassDto,
    currentUser: any,
  ): Promise<AcademicClass> {
    const newClass = this.academicClassRepo.create({
      ...dto,
      campusId: currentUser.campusId,
    });
    return this.academicClassRepo.save(newClass);
  }

  async findAllClasses(currentUser: any): Promise<AcademicClass[]> {
    const whereClause = currentUser.isSuperAdmin
      ? {}
      : { campusId: currentUser.campusId };
    return this.academicClassRepo.find({
      where: whereClause,
      relations: { sections: true, subjects: true },
    });
  }

  async findClassById(id: string, currentUser: any): Promise<AcademicClass> {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const cls = await this.academicClassRepo.findOne({
      where: whereClause,
      relations: { sections: true, subjects: true },
    });
    if (!cls) throw new NotFoundException('Class not found');
    return cls;
  }

  async updateClass(
    id: string,
    dto: UpdateAcademicClassDto,
    currentUser: any,
  ): Promise<AcademicClass> {
    const cls = await this.findClassById(id, currentUser);
    await this.academicClassRepo.update(cls.id, dto);
    return this.findClassById(id, currentUser);
  }

  async removeClass(id: string, currentUser: any): Promise<void> {
    const cls = await this.findClassById(id, currentUser);
    const result = await this.academicClassRepo.delete(cls.id);
    if (result.affected === 0) throw new NotFoundException('Class not found');
  }

  // --- Sections ---
  async createSection(
    dto: CreateSectionDto,
    currentUser: any,
  ): Promise<Section> {
    await this.findClassById(dto.classId, currentUser);
    const section = this.sectionRepo.create({
      ...dto,
      campusId: currentUser.campusId,
    });
    return this.sectionRepo.save(section);
  }

  async updateSection(
    id: string,
    dto: UpdateSectionDto,
    currentUser: any,
  ): Promise<Section> {
    if (dto.classId) await this.findClassById(dto.classId, currentUser);
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const existing = await this.sectionRepo.findOne({ where: whereClause });
    if (!existing) throw new NotFoundException('Section not found');
    const section = await this.sectionRepo.preload({ id, ...dto });
    if (!section) throw new NotFoundException('Section not found');
    return this.sectionRepo.save(section);
  }

  async removeSection(id: string, currentUser: any): Promise<void> {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const existing = await this.sectionRepo.findOne({ where: whereClause });
    if (!existing) throw new NotFoundException('Section not found');
    const result = await this.sectionRepo.delete(existing.id);
    if (result.affected === 0) throw new NotFoundException('Section not found');
  }

  // --- Subjects ---
  async createSubject(
    dto: CreateSubjectDto,
    currentUser: any,
  ): Promise<Subject> {
    await this.findClassById(dto.classId, currentUser);
    const subject = this.subjectRepo.create({
      ...dto,
      campusId: currentUser.campusId,
    });
    return this.subjectRepo.save(subject);
  }

  async updateSubject(
    id: string,
    dto: UpdateSubjectDto,
    currentUser: any,
  ): Promise<Subject> {
    if (dto.classId) await this.findClassById(dto.classId, currentUser);
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const existing = await this.subjectRepo.findOne({ where: whereClause });
    if (!existing) throw new NotFoundException('Subject not found');
    const subject = await this.subjectRepo.preload({ id, ...dto });
    if (!subject) throw new NotFoundException('Subject not found');
    return this.subjectRepo.save(subject);
  }

  async removeSubject(id: string, currentUser: any): Promise<void> {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const existing = await this.subjectRepo.findOne({ where: whereClause });
    if (!existing) throw new NotFoundException('Subject not found');
    const result = await this.subjectRepo.delete(existing.id);
    if (result.affected === 0) throw new NotFoundException('Subject not found');
  }

  // --- Teacher Assignments ---
  async assignTeacher(
    dto: AssignTeacherDto,
    currentUser: any,
  ): Promise<TeacherAssignment> {
    const whereSection: any = { id: dto.sectionId };
    if (!currentUser.isSuperAdmin) whereSection.campusId = currentUser.campusId;
    const section = await this.sectionRepo.findOne({ where: whereSection });
    if (!section) throw new NotFoundException('Section not found');

    const whereSubject: any = { id: dto.subjectId };
    if (!currentUser.isSuperAdmin) whereSubject.campusId = currentUser.campusId;
    const subject = await this.subjectRepo.findOne({ where: whereSubject });
    if (!subject) throw new NotFoundException('Subject not found');

    // We can't strictly check if role is TEACHER anymore using enum.
    // We will just verify user exists and belongs to campus (if needed).
    const whereTeacher: any = { id: dto.teacherId };
    if (!currentUser.isSuperAdmin) whereTeacher.campusId = currentUser.campusId;
    const teacher = await this.userRepo.findOne({ where: whereTeacher });
    if (!teacher)
      throw new NotFoundException('Teacher not found or not in campus');

    const whereAssignment: any = {
      sectionId: dto.sectionId,
      subjectId: dto.subjectId,
    };
    if (!currentUser.isSuperAdmin)
      whereAssignment.campusId = currentUser.campusId;
    const existing = await this.teacherAssignmentRepo.findOne({
      where: whereAssignment,
    });

    if (existing) {
      existing.teacherId = dto.teacherId;
      return this.teacherAssignmentRepo.save(existing);
    }

    const assignment = this.teacherAssignmentRepo.create({
      ...dto,
      campusId: currentUser.campusId,
    });
    return this.teacherAssignmentRepo.save(assignment);
  }

  async removeTeacherAssignment(id: string, currentUser: any): Promise<void> {
    const whereClause: any = { id };
    if (!currentUser.isSuperAdmin) whereClause.campusId = currentUser.campusId;
    const existing = await this.teacherAssignmentRepo.findOne({
      where: whereClause,
    });
    if (!existing) throw new NotFoundException('Assignment not found');

    const result = await this.teacherAssignmentRepo.delete(existing.id);
    if (result.affected === 0)
      throw new NotFoundException('Assignment not found');
  }
}
