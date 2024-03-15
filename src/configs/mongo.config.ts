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
    @IsNotEmpty()
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

    public constructor() {
        this.rootUsername = process.env.MONGO_ROOT_USERNAME!;
        this.rootPassword = process.env.MONGO_ROOT_PASSWORD!;
        this.host = process.env.MONGO_HOST!;
        this.port = parseInt(process.env.MONGO_PORT!);
        this.database = process.env.MONGO_DATABASE!;
    }
}

export const mongoConfig = new MongoConfig();
const validationResult = validateSync(mongoConfig);
if (validationResult.length > 0) {
    console.log(validationResult);
    throw new Error();
}
