import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private mailQueue: Queue) {}

  async sendPasswordReset(email: string, name: string, resetToken: string, frontendUrl: string) {
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
    await this.mailQueue.add('send', {
      to: email,
      subject: 'Reset Your EduCore Password',
      template: './password-reset',
      context: { name, resetLink, expiresIn: '15 minutes' },
    });
  }

  async sendWelcome(email: string, name: string, tempPassword: string) {
    await this.mailQueue.add('send', {
      to: email,
      subject: 'Welcome to EduCore LMS!',
      template: './welcome',
      context: { name, email, tempPassword },
    });
  }

  async sendApplicationApproved(email: string, name: string, courseName: string) {
    await this.mailQueue.add('send', {
      to: email,
      subject: 'Application Approved — EduCore LMS',
      template: './application-approved',
      context: { name, courseName },
    });
  }

  async sendApplicationRejected(email: string, name: string, courseName: string, reason: string) {
    await this.mailQueue.add('send', {
      to: email,
      subject: 'Application Update — EduCore LMS',
      template: './application-rejected',
      context: { name, courseName, reason },
    });
  }

  async sendFeeReminder(email: string, name: string, amount: number, dueDate: string) {
    await this.mailQueue.add('send', {
      to: email,
      subject: `Fee Payment Reminder — PKR ${amount.toLocaleString()} Due`,
      template: './fee-reminder',
      context: { name, amount: amount.toLocaleString(), dueDate },
    });
  }
}
