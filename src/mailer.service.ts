import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { MailerConfig } from './configs/mailer.config';

@Injectable()
export class MailerService {
    public constructor(private mailerConfig: MailerConfig) {}

    public async notifyAdmin(subject: string, text: string) {
        const transporter = nodemailer.createTransport({
            host: this.mailerConfig.smtpServerDomain,
            port: this.mailerConfig.smtpServerPort,
            secure: false,
        });

        try {
            await transporter.sendMail({
                from: this.mailerConfig.serviceAddress,
                to: this.mailerConfig.adminAddress,
                subject: subject,
                text: text,
            });
        } catch (e: unknown) {
            console.log('Failed to send email.');
        }
    }
}
