import fs from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { FileSystemConfig } from 'src/configs/file-system.config';

@Injectable()
export class FileSystemAdapter {
    public constructor(private fileSystemConfig: FileSystemConfig) {}

    public async getAvatar(path: string): Promise<Buffer> {
        await this.makeDirectoryIfDoesNotExist();
        return await fs.readFile(
            `./${this.fileSystemConfig.avatarStoragePath}/${path}.jpg`,
        );
    }

    public async saveAvatar(path: string, avatar: Buffer): Promise<void> {
        await this.makeDirectoryIfDoesNotExist();
        await fs.writeFile(
            `./${this.fileSystemConfig.avatarStoragePath}/${path}.jpg`,
            avatar,
        );
    }

    public async deleteAvatar(path: string): Promise<void> {
        await this.makeDirectoryIfDoesNotExist();
        await fs.rm(`./${this.fileSystemConfig.avatarStoragePath}/${path}.jpg`);
    }

    private async makeDirectoryIfDoesNotExist(): Promise<void> {
        let blockingFile = false;
        try {
            const stat = await fs.stat(
                `./${this.fileSystemConfig.avatarStoragePath}`,
            );
            if (!stat.isDirectory()) {
                blockingFile = true;
            }
        } catch (e: unknown) {
            await fs.mkdir(`./${this.fileSystemConfig.avatarStoragePath}`);
        }

        if (blockingFile === true) {
            throw new Error('Directory for avatars cannot be made.');
        }
    }
}
