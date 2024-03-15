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
export class MailerConfig {
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

    public constructor() {
        this.smtpServerDomain = process.env.MAILER_SMTP_SERVER_DOMAIN!;
        this.smtpServerPort = parseInt(process.env.MAILER_SMTP_SERVER_PORT!);
        this.serviceAddress = process.env.MAILER_SERVICE_ADDRESS!;
        this.adminAddress = process.env.MAILER_ADMIN_ADDRESS!;
    }
}

export const mailerConfig = new MailerConfig();
const validationResult = validateSync(mailerConfig);
if (validationResult.length > 0) {
    console.log(validationResult);
    throw new Error();
}
