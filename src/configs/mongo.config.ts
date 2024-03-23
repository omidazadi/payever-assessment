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
export class MongoConfig {
    @IsString()
    @IsNotEmpty()
    public rootUsername: string;

    @IsString()
    public rootPassword: string;

    @IsString()
    @IsNotEmpty()
    public host: string;

    @Min(0)
    @Max(65535)
    @IsNumber()
    @IsNotEmpty()
    public port: number;

    @IsString()
    @IsNotEmpty()
    public database: string;

    public constructor(
        values?:
            | {
                  rootUsername: string;
                  rootPassword: string;
                  host: string;
                  port: number;
                  database: string;
              }
            | undefined,
    ) {
        if (typeof values === 'undefined') {
            this.rootUsername = process.env.MONGO_ROOT_USERNAME || 'root';
            this.rootPassword = process.env.MONGO_ROOT_PASSWORD || '';
            this.host = process.env.MONGO_HOST || 'localhost';
            this.port = parseInt(process.env.MONGO_PORT || '27017');
            this.database = process.env.MONGO_DATABASE || 'payever';
        } else {
            this.rootUsername = values.rootUsername;
            this.rootPassword = values.rootPassword;
            this.host = values.host;
            this.port = values.port;
            this.database = values.database;
        }
    }
}

export const mongoConfig = new MongoConfig();
const validationResult = validateSync(mongoConfig);
if (validationResult.length > 0) {
    console.log(validationResult);
    throw new Error();
}
