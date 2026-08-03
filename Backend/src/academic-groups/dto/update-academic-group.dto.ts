import { PartialType } from '@nestjs/swagger';
import { CreateAcademicGroupDto } from './create-academic-group.dto';

export class UpdateAcademicGroupDto extends PartialType(CreateAcademicGroupDto) {}
