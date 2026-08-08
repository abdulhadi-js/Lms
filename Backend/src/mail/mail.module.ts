import { RolesModule } from '../roles/roles.module';
import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [RolesModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
