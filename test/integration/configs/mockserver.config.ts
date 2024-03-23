import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsNumber, Max, Min, validateSync } from 'class-validator';

@Injectable()
export class MockserverConfig {
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
            this.port = parseInt(process.env.MOCKSERVER_PORT || '10001');
        } else {
            this.port = values.port;
        }
    }
}

export const mockserverConfig = new MockserverConfig();
const validationResult = validateSync(mockserverConfig);
if (validationResult.length > 0) {
    console.log(validationResult);
    throw new Error();
}
