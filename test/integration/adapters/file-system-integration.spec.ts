import fs from 'fs/promises';
import { fileSystemConfig } from 'src/configs/file-system.config';
import { FileSystemAdapter } from 'src/adapters/file-system.adapter';

describe('[integration] File System Integration Tests', function () {
    let fileSystemAdapter: FileSystemAdapter;

    beforeAll(function () {
        fileSystemAdapter = new FileSystemAdapter(fileSystemConfig);
    });

    afterAll(async function () {
        await fs.rm(fileSystemConfig.avatarStoragePath, {
            recursive: true,
            force: true,
        });
    });

    // Basic Arrange
    beforeEach(async function () {
        await fs.rm(fileSystemConfig.avatarStoragePath, {
            recursive: true,
            force: true,
        });
    });

    it(`FileSystemAdapter.getAvatar - Directory and Avatar Do Not Exist - Create Directory and Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        let err;

        // Act
        try {
            await fileSystemAdapter.getAvatar('xxx');
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(
            (
                await fs.stat(`./${fileSystemConfig.avatarStoragePath}`)
            ).isDirectory(),
        ).toBe(true);
        expect(err).toBeDefined();
    });

    it(`FileSystemAdapter.getAvatar - Directory and Avatar Exist - Return the Avatar`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        await fs.mkdir(fileSystemConfig.avatarStoragePath);
        await fs.writeFile(
            `${fileSystemConfig.avatarStoragePath}/xxx.jpg`,
            Buffer.from([0x01, 0x02]),
        );
        let err, result;

        // Act
        try {
            result = await fileSystemAdapter.getAvatar('xxx');
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(result).toStrictEqual(Buffer.from([0x01, 0x02]));
        expect(err).not.toBeDefined();
    });

    it(`FileSystemAdapter.saveAvatar - Directory and Avatar Do Not Exist - Create Directory and Store the Avatar`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        let err;

        // Act
        try {
            await fileSystemAdapter.saveAvatar(
                'xxx',
                Buffer.from([0x01, 0x02]),
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(
            (
                await fs.stat(`./${fileSystemConfig.avatarStoragePath}`)
            ).isDirectory(),
        ).toBe(true);
        await expect(
            fs.readFile(`./${fileSystemConfig.avatarStoragePath}/xxx.jpg`),
        ).resolves.toStrictEqual(Buffer.from([0x01, 0x02]));
        expect(err).not.toBeDefined();
    });

    it(`FileSystemAdapter.deleteAvatar - Directory and Avatar Exist - Delete the Avatar`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        await fs.mkdir(fileSystemConfig.avatarStoragePath);
        await fs.writeFile(
            `${fileSystemConfig.avatarStoragePath}/xxx.jpg`,
            Buffer.from([0x01, 0x02]),
        );
        let err;

        // Act
        try {
            await fileSystemAdapter.deleteAvatar('xxx');
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        await expect(
            fs.stat(`./${fileSystemConfig.avatarStoragePath}/xxx.jpg`),
        ).rejects.toThrow();
        expect(err).not.toBeDefined();
    });
});
