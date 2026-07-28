import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

@Processor('mail')
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailerService: MailerService) {}

  @Process('send')
  async handleSendMail(job: Job) {
    this.logger.debug(`Processing email job for: ${job.data.to}`);
    try {
      await this.mailerService.sendMail(job.data);
      this.logger.debug(`Successfully sent email to: ${job.data.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${job.data.to}: ${error.message}`);
      throw error;
    }
  }
}
