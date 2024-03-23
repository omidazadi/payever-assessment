import { FileSystemConfig } from 'src/configs/file-system.config';
import { FileSystemAdapter } from '../file-system.adapter';

/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('fs/promises');
const fs = require('fs/promises');

describe('[unit] FileSystemAdapter Tests', function () {
    let fileSystemConfig: FileSystemConfig;
    let fileSystemAdapter: FileSystemAdapter;

    beforeAll(function () {
        fileSystemConfig = new FileSystemConfig({
            avatarStoragePath: 'unit-test-path',
        });
        fileSystemAdapter = new FileSystemAdapter(fileSystemConfig);
    });

    // Basic Arrange
    beforeEach(async function () {
        jest.clearAllMocks();
    });

    it(`FileSystemAdapter.getAvatar - Avatar and Directory Do Not Exist - Create Directory and Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        fs.readFile.mockImplementation(async function () {
            throw new Error();
        });
        fs.stat.mockImplementation(async function () {
            throw new Error();
        });
        fs.mkdir = jest.fn();
        let errorOccured = false;

        // Act
        try {
            await fileSystemAdapter.getAvatar('xxx');
        } catch (e: unknown) {
            errorOccured = true;
        }

        // Assert
        expect(fs.mkdir.mock.calls).toHaveLength(1);
        expect(fs.mkdir.mock.calls[0][0]).toBe('./unit-test-path');
        expect(fs.stat.mock.calls).toHaveLength(1);
        expect(fs.stat.mock.calls[0][0]).toBe('./unit-test-path');
        expect(fs.readFile.mock.calls).toHaveLength(1);
        expect(fs.readFile.mock.calls[0][0]).toBe('./unit-test-path/xxx.jpg');
        expect(errorOccured).toBe(true);
    });

    it(`FileSystemAdapter.getAvatar - Directory Exists, but Avatar Does Not - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const isDirectory = jest.fn(function () {
            return true;
        });
        fs.readFile.mockImplementation(async function () {
            throw new Error();
        });
        fs.stat.mockImplementation(async function () {
            return {
                isDirectory: isDirectory,
            };
        });
        fs.mkdir = jest.fn();
        let errorOccured = false;

        // Act
        try {
            await fileSystemAdapter.getAvatar('xxx');
        } catch (e: unknown) {
            errorOccured = true;
        }

        // Assert
        expect(fs.mkdir.mock.calls).toHaveLength(0);
        expect(fs.stat.mock.calls).toHaveLength(1);
        expect(fs.stat.mock.calls[0][0]).toBe('./unit-test-path');
        expect(isDirectory.mock.calls).toHaveLength(1);
        expect(fs.readFile.mock.calls).toHaveLength(1);
        expect(fs.readFile.mock.calls[0][0]).toBe('./unit-test-path/xxx.jpg');
        expect(errorOccured).toBe(true);
    });

    it(`FileSystemAdapter.getAvatar - Directory Path is a File - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const isDirectory = jest.fn(function () {
            return false;
        });
        fs.readFile = jest.fn();
        fs.stat.mockImplementation(async function () {
            return {
                isDirectory: isDirectory,
            };
        });
        fs.mkdir = jest.fn();
        let errorOccured = false;

        // Act
        try {
            await fileSystemAdapter.getAvatar('xxx');
        } catch (e: unknown) {
            errorOccured = true;
        }

        // Assert
        expect(fs.mkdir.mock.calls).toHaveLength(0);
        expect(fs.stat.mock.calls).toHaveLength(1);
        expect(fs.stat.mock.calls[0][0]).toBe('./unit-test-path');
        expect(isDirectory.mock.calls).toHaveLength(1);
        expect(fs.readFile.mock.calls).toHaveLength(0);
        expect(errorOccured).toBe(true);
    });

    it(`FileSystemAdapter.getAvatar - Directory and Avatar Exist - Return the Avatar`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const isDirectory = jest.fn(function () {
            return true;
        });
        fs.readFile.mockResolvedValue(Buffer.from('xxx', 'utf-8'));
        fs.stat.mockImplementation(async function () {
            return {
                isDirectory: isDirectory,
            };
        });
        fs.mkdir = jest.fn();
        let errorOccured = false,
            avatar;

        // Act
        try {
            avatar = await fileSystemAdapter.getAvatar('xxx');
        } catch (e: unknown) {
            errorOccured = true;
        }

        // Assert
        expect(fs.mkdir.mock.calls).toHaveLength(0);
        expect(fs.stat.mock.calls).toHaveLength(1);
        expect(fs.stat.mock.calls[0][0]).toBe('./unit-test-path');
        expect(isDirectory.mock.calls).toHaveLength(1);
        expect(fs.readFile.mock.calls).toHaveLength(1);
        expect(fs.readFile.mock.calls[0][0]).toBe('./unit-test-path/xxx.jpg');
        expect(avatar).toStrictEqual(Buffer.from('xxx', 'utf-8'));
        expect(errorOccured).toBe(false);
    });

    it(`FileSystemAdapter.saveAvatar - Directory Exists - Save the Avatar`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const isDirectory = jest.fn(function () {
            return true;
        });
        fs.writeFile = jest.fn();
        fs.stat.mockImplementation(async function () {
            return {
                isDirectory: isDirectory,
            };
        });
        fs.mkdir = jest.fn();
        let errorOccured = false;

        // Act
        try {
            await fileSystemAdapter.saveAvatar(
                'xxx',
                Buffer.from('xxx', 'utf-8'),
            );
        } catch (e: unknown) {
            errorOccured = true;
        }

        // Assert
        expect(fs.mkdir.mock.calls).toHaveLength(0);
        expect(fs.stat.mock.calls).toHaveLength(1);
        expect(fs.stat.mock.calls[0][0]).toBe('./unit-test-path');
        expect(isDirectory.mock.calls).toHaveLength(1);
        expect(fs.writeFile.mock.calls).toHaveLength(1);
        expect(fs.writeFile.mock.calls[0][0]).toBe('./unit-test-path/xxx.jpg');
        expect(fs.writeFile.mock.calls[0][1]).toStrictEqual(
            Buffer.from('xxx', 'utf-8'),
        );
        expect(errorOccured).toBe(false);
    });

    it(`FileSystemAdapter.deleteAvatar - Directory Exists, but Avatar Does Not - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const isDirectory = jest.fn(function () {
            return true;
        });
        fs.stat.mockImplementation(async function () {
            return {
                isDirectory: isDirectory,
            };
        });
        fs.mkdir = jest.fn();
        fs.rm.mockImplementation(async function () {
            throw new Error();
        });
        let errorOccured = false;

        // Act
        try {
            await fileSystemAdapter.deleteAvatar('xxx');
        } catch (e: unknown) {
            errorOccured = true;
        }

        // Assert
        expect(fs.mkdir.mock.calls).toHaveLength(0);
        expect(fs.stat.mock.calls).toHaveLength(1);
        expect(fs.stat.mock.calls[0][0]).toBe('./unit-test-path');
        expect(isDirectory.mock.calls).toHaveLength(1);
        expect(fs.rm.mock.calls).toHaveLength(1);
        expect(fs.rm.mock.calls[0][0]).toBe('./unit-test-path/xxx.jpg');
        expect(errorOccured).toBe(true);
    });

    it(`[unit] FileSystemAdapter.deleteAvatar - Directory and Avatar Exist - Delete the Avatar`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const isDirectory = jest.fn(function () {
            return true;
        });
        fs.stat.mockImplementation(async function () {
            return {
                isDirectory: isDirectory,
            };
        });
        fs.mkdir = jest.fn();
        fs.rm = jest.fn();
        let errorOccured = false;

        // Act
        try {
            await fileSystemAdapter.deleteAvatar('xxx');
        } catch (e: unknown) {
            errorOccured = true;
        }

        // Assert
        expect(fs.mkdir.mock.calls).toHaveLength(0);
        expect(fs.stat.mock.calls).toHaveLength(1);
        expect(fs.stat.mock.calls[0][0]).toBe('./unit-test-path');
        expect(isDirectory.mock.calls).toHaveLength(1);
        expect(fs.rm.mock.calls).toHaveLength(1);
        expect(fs.rm.mock.calls[0][0]).toBe('./unit-test-path/xxx.jpg');
        expect(errorOccured).toBe(false);
    });
});
