import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

@Injectable()
export class FileSystemConfig {
    @IsString()
    @IsNotEmpty()
    public avatarStoragePath: string;

    public constructor(
        values?:
            | {
                  avatarStoragePath: string;
              }
            | undefined,
    ) {
        if (typeof values === 'undefined') {
            this.avatarStoragePath =
                process.env.FILE_SYSTEM_AVATAR_STORAGE_PATH || 'avatar';
        } else {
            this.avatarStoragePath = values.avatarStoragePath;
        }
    }
}

export const fileSystemConfig = new FileSystemConfig();
const validationResult = validateSync(fileSystemConfig);
if (validationResult.length > 0) {
    console.log(validationResult);
    throw new Error();
}
