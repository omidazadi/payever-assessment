import { Injectable } from '@nestjs/common';
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
    validateSync,
} from 'class-validator';

@Injectable()
export class RMQConfig {
    @IsString()
    @IsNotEmpty()
    public host: string;

    @Min(0)
    @Max(65535)
    @IsNumber()
    @IsNotEmpty()
    public port: number;

    public constructor(values?: { host: string; port: number } | undefined) {
        if (typeof values === 'undefined') {
            this.host = process.env.RMQ_HOST || 'localhost';
            this.port = parseInt(process.env.RMQ_PORT || '5672');
        } else {
            this.host = values.host;
            this.port = values.port;
        }
    }
}

export const rmqConfig = new RMQConfig();
const validationResult = validateSync(rmqConfig);
if (validationResult.length > 0) {
    console.log(validationResult);
    throw new Error();
}
