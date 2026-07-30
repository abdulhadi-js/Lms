import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffProfile } from './entities/staff-profile.entity';
import { UpdateStaffProfileDto } from './dto/update-staff-profile.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(StaffProfile)
    private staffProfileRepository: Repository<StaffProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async updateStaffProfile(
    userId: string,
    dto: UpdateStaffProfileDto,
  ): Promise<StaffProfile> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { staffProfile: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let profile = user.staffProfile;
    if (!profile) {
      profile = this.staffProfileRepository.create({ userId: user.id });
    }

    Object.assign(profile, dto);
    const savedProfile = await this.staffProfileRepository.save(profile);

    // Ensure one-to-one is saved on user if creating
    if (!user.staffProfile) {
      user.staffProfile = savedProfile;
      await this.userRepository.save(user);
    }

    return savedProfile;
  }

  async getStaffProfile(userId: string): Promise<StaffProfile> {
    const profile = await this.staffProfileRepository.findOne({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException('Staff profile not found');
    }
    return profile;
  }
}
