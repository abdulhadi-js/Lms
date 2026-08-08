import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor() {}

  private async sendMail(options: {
    to: string;
    subject: string;
    template: string;
    context: Record<string, any>;
  }) {
    this.logger.log(`[MOCK EMAIL] Sent to ${options.to} with subject "${options.subject}"`);
  }

  async sendPasswordReset(
    email: string,
    name: string,
    resetToken: string,
    frontendUrl: string,
  ) {
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
    await this.sendMail({
      to: email,
      subject: 'Reset Your EduCore Password',
      template: './password-reset',
      context: { name, resetLink, expiresIn: '15 minutes' },
    });
  }

  async sendWelcome(email: string, name: string, tempPassword: string) {
    await this.sendMail({
      to: email,
      subject: 'Welcome to EduCore LMS!',
      template: './welcome',
      context: { name, email, tempPassword },
    });
  }

  async sendApplicationApproved(
    email: string,
    name: string,
    courseName: string,
  ) {
    await this.sendMail({
      to: email,
      subject: 'Application Approved — EduCore LMS',
      template: './application-approved',
      context: { name, courseName },
    });
  }

  async sendApplicationRejected(
    email: string,
    name: string,
    courseName: string,
    reason: string,
  ) {
    await this.sendMail({
      to: email,
      subject: 'Application Update — EduCore LMS',
      template: './application-rejected',
      context: { name, courseName, reason },
    });
  }

  async sendFeeReminder(
    email: string,
    name: string,
    amount: number,
    dueDate: string,
  ) {
    await this.sendMail({
      to: email,
      subject: `Fee Payment Reminder — PKR ${amount.toLocaleString()} Due`,
      template: './fee-reminder',
      context: { name, amount: amount.toLocaleString(), dueDate },
    });
  }
}
