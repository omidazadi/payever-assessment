import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsString, IsUrl, validateSync } from 'class-validator';

@Injectable()
export class ReqresConfig {
    @IsUrl({ require_tld: false })
    @IsString()
    @IsNotEmpty()
    public baseUrl: string;

    public constructor(
        values?:
            | {
                  baseUrl: string;
              }
            | undefined,
    ) {
        if (typeof values === 'undefined') {
            this.baseUrl = process.env.REQRES_BASE_URL || 'https://reqres.in';
        } else {
            this.baseUrl = values.baseUrl;
        }
    }
}

export const reqresConfig = new ReqresConfig();
const validationResult = validateSync(reqresConfig);
if (validationResult.length > 0) {
    console.log(validationResult);
    throw new Error();
}
