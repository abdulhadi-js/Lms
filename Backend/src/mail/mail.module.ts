import { MailerModule } from '@nestjs-modules/mailer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HandlebarsAdapter } = require('@nestjs-modules/mailer/dist/adapters/handlebars.adapter');
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
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
          from: configService.get<string>('MAIL_FROM', '"EduCore LMS" <noreply@educore.com>'),
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
