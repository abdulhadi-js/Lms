import { RolesModule } from '../roles/roles.module';
import { Module, Global } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.config';
import { CloudinaryService } from './cloudinary.service';

@Global()
@Module({
  imports: [RolesModule],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
