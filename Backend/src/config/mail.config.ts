import { join } from 'path';
import { ConfigService } from '@nestjs/config';

export const mailConfig = (configService: ConfigService) => ({
  transport: {
    host: configService.get<string>('MAIL_HOST'),
    port: configService.get<number>('MAIL_PORT', 587),
    secure: configService.get<number>('MAIL_PORT', 587) === 465,
    auth: {
      user: configService.get<string>('MAIL_USER'),
      pass: configService.get<string>('MAIL_PASS'),
    },
  },
  defaults: {
    from: configService.get<string>(
      'MAIL_FROM',
      '"EduCore LMS" <noreply@educore.com>',
    ),
  },
  template: {
    dir: join(__dirname, '..', 'mail', 'templates'),
    adapter: 'handlebars' as any,
    options: { strict: true },
  },
});
