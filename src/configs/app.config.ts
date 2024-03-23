import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsNumber, Max, Min, validateSync } from 'class-validator';

@Injectable()
export class AppConfig {
    @Min(0)
    @Max(65535)
    @IsNumber()
    @IsNotEmpty()
    public port: number;

    public constructor(
        values?:
            | {
                  port: number;
              }
            | undefined,
    ) {
        if (typeof values === 'undefined') {
            this.port = parseInt(process.env.APP_PORT || '3000');
        } else {
            this.port = values.port;
        }
    }
}

export const appConfig = new AppConfig();
const validationResult = validateSync(appConfig);
if (validationResult.length > 0) {
    console.log(validationResult);
    throw new Error();
}
