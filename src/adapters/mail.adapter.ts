import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { MailConfig } from '../configs/mail.config';

@Injectable()
export class MailAdapter {
    public constructor(private mailConfig: MailConfig) {}

    public async notifyAdmin(subject: string, text: string) {
        const transporter = nodemailer.createTransport({
            host: this.mailConfig.smtpServerDomain,
            port: this.mailConfig.smtpServerPort,
            secure: false,
        });

        await transporter.sendMail({
            from: this.mailConfig.serviceAddress,
            to: this.mailConfig.adminAddress,
            subject: subject,
            text: text,
        });
    }
}
