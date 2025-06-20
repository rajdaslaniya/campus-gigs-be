import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  sendOtpMail(toEmail: string, name: string, otp: number) {
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, '../../emails/otp-verification-email-template.html'),
      'utf-8',
    );

    const customizedHtml = emailTemplate
      .replace('[Recipient Name]', name)
      .replace('[(OTP)]', String(otp))
      .replace('[home page link]', `${process.env.CLIENT_URL1}`);

    this.mailService.sendMail({
      from: `Campusgigs <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Welcome to Campusgigs!',
      html: customizedHtml,
    });
  }
}
