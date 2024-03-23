import { Injectable } from '@nestjs/common';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
    validateSync,
} from 'class-validator';

@Injectable()
export class MailConfig {
    @IsString()
    @IsNotEmpty()
    public smtpServerDomain: string;

    @Min(0)
    @Max(65535)
    @IsNumber()
    @IsNotEmpty()
    public smtpServerPort: number;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    public serviceAddress: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    public adminAddress: string;

    public constructor(
        values?:
            | {
                  smtpServerDomain: string;
                  smtpServerPort: number;
                  serviceAddress: string;
                  adminAddress: string;
              }
            | undefined,
    ) {
        if (typeof values === 'undefined') {
            this.smtpServerDomain =
                process.env.MAIL_SMTP_SERVER_DOMAIN || 'gmail.com';
            this.smtpServerPort = parseInt(
                process.env.MAIL_SMTP_SERVER_PORT || '25',
            );
            this.serviceAddress =
                process.env.MAIL_SERVICE_ADDRESS || 'service@gmail.com';
            this.adminAddress =
                process.env.MAIL_ADMIN_ADDRESS || 'admin@gmail.com';
        } else {
            this.smtpServerDomain = values.smtpServerDomain;
            this.smtpServerPort = values.smtpServerPort;
            this.serviceAddress = values.serviceAddress;
            this.adminAddress = values.adminAddress;
        }
    }
}

export const mailConfig = new MailConfig();
const validationResult = validateSync(mailConfig);
if (validationResult.length > 0) {
    console.log(validationResult);
    throw new Error();
}
