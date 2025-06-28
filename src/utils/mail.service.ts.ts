// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendMail(email: string, pin: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Doniyor production" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Password Code',
      text: `Your reset code is: ${pin}`,
      html: `<b><h1>Your reset code is:</h1></b> <span style="font-size: 20px">${pin}</span>`,
    });
  }
}
