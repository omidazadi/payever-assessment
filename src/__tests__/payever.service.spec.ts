import { HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PayeverService } from 'src/payever.service';

/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('../adapters/file-system.adapter');
jest.mock('../adapters/mail.adapter');
jest.mock('../adapters/reqres.adapter');
const { FileSystemAdapter } = require('../adapters/file-system.adapter');
const { MailAdapter } = require('../adapters/mail.adapter');
const { ReqresAdapter } = require('../adapters/reqres.adapter');

describe('[unit] PayeverService Tests', function () {
    let payeverService: PayeverService;
    let messageQueue: any;
    let userModel: any;
    let avatarModel: any;
    let mailAdapter: any;
    let reqresAdapter: any;
    let fileSystemAdapter: any;

    // Basic Arrange
    beforeEach(async function () {
        messageQueue = jest.fn();
        messageQueue.emit = jest.fn(function () {
            return new Observable(function (subscriber) {
                subscriber.next(1);
                subscriber.complete();
            });
        });
        userModel = jest.fn();
        userModel.prototype.save = jest.fn();
        userModel.findOne = jest.fn();
        userModel.findOneAndDelete = jest.fn();
        avatarModel = jest.fn();
        avatarModel.prototype.save = jest.fn();
        avatarModel.findOne = jest.fn();
        avatarModel.findOneAndDelete = jest.fn();
        mailAdapter = new MailAdapter();
        fileSystemAdapter = new FileSystemAdapter();
        reqresAdapter = new ReqresAdapter();
        jest.clearAllMocks();
    });

    it(`PayeverService.createUser - User Already Exists - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        userModel = jest.fn();
        userModel.prototype.save = jest.fn(async function () {
            const e: any = new Object();
            e.code = 11000;
            throw e;
        });
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.createUser(
                1,
                'azadiomid80@gmail.com',
                'Omid',
                'Azadi',
                'google.com',
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response).toBe('User already exists.');
    });

    it(`PayeverService.createUser - Mongo Throws an Unexpected Error - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        userModel = jest.fn();
        userModel.prototype.save = jest.fn(async function () {
            throw new Error();
        });
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.createUser(
                1,
                'azadiomid80@gmail.com',
                'Omid',
                'Azadi',
                'google.com',
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response).toBe('Could not proceed with the request.');
    });

    it(`PayeverService.createUser - Mail Adapter Throws an Exception - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        mailAdapter.notifyAdmin = jest.fn(async function () {
            throw new Error();
        });
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.createUser(
                1,
                'azadiomid80@gmail.com',
                'Omid',
                'Azadi',
                'google.com',
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response).toBe('Could not proceed with the request.');
    });

    it(`PayeverService.createUser - RabbitMQ Throws an Exception - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        messageQueue.emit = jest.fn(function () {
            return new Observable(function (subscriber) {
                subscriber.error(new Error());
            });
        });
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.createUser(
                1,
                'azadiomid80@gmail.com',
                'Omid',
                'Azadi',
                'google.com',
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response).toBe('Could not proceed with the request.');
    });

    it(`PayeverService.createUser - Everything Works as Expected - Create the User`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.createUser(
                1,
                'azadiomid80@gmail.com',
                'Omid',
                'Azadi',
                'google.com',
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).not.toBeDefined();
    });

    it(`PayeverService.getUser - Reqres Request Fails - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        reqresAdapter.getUser = jest.fn(async function () {
            throw new Error();
        });
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.getUser(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response).toBe('Could not proceed with the request.');
    });

    it(`PayeverService.getUser - Everything Works as Expected - Retrieve the User`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        reqresAdapter.getUser = jest.fn(async function () {
            return {
                data: {
                    id: 10,
                    email: 'azadiomid80@gmail.com',
                    first_name: 'omid',
                    last_name: 'azadi',
                    avatar: 'google.com',
                },
                support: {
                    text: 'Plz support me!',
                    url: 'google.com',
                },
            };
        });
        userModel = jest.fn(function () {
            return { yay: 1 };
        });
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err, user;

        // Act
        try {
            user = await payeverService.getUser(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).not.toBeDefined();
        expect(user).toStrictEqual({ yay: 1 });
    });

    it(`PayeverService.getAvatar - Mongo Entry Exists, but Avatar is Not Saved in the File System - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        avatarModel.findOne.mockResolvedValue({ userId: 1, hash: 'hash' });
        fileSystemAdapter.getAvatar.mockRejectedValue(new Error());
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.getAvatar(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response).toBe('Internal Server Error.');
    });

    it(`PayeverService.getAvatar - Mongo Entry Exists and Avatar is Saved in the File System - Return the Saved Avatar`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        avatarModel.findOne.mockResolvedValue({ userId: 1, hash: 'hash' });
        fileSystemAdapter.getAvatar.mockResolvedValue(
            Buffer.from([0x01, 0x02]),
        );
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err, result;

        // Act
        try {
            result = await payeverService.getAvatar(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).not.toBeDefined();
        expect(result[0]).toBe(Buffer.from([0x01, 0x02]).toString('base64'));
        expect(result[1]).toBe(true);
    });

    it(`PayeverService.getAvatar - Mongo Entry Does Not Exist, and Reqres Request to Fetch User Fails - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        avatarModel.findOne.mockResolvedValue(null);
        reqresAdapter.getUser.mockRejectedValue(new Error());
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.getAvatar(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response).toBe('Could not proceed with the request.');
    });

    it(`PayeverService.getAvatar - Mongo Entry Does Not Exist, and Reqres Request to Fetch Avatar Fails - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        avatarModel.findOne.mockResolvedValue(null);
        reqresAdapter.getUser.mockResolvedValue({ data: { avatar: 'aa' } });
        reqresAdapter.downloadResource.mockRejectedValue(new Error());
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.getAvatar(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response).toBe('Could not proceed with the request.');
    });

    it(`PayeverService.getAvatar - Mongo Entry Does Not Exist, and Mongo Fails to Store the Fetched Avatar - Throw Raw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        avatarModel.findOne.mockResolvedValue(null);
        reqresAdapter.getUser.mockResolvedValue({ data: { avatar: 'aa' } });
        reqresAdapter.downloadResource.mockResolvedValue(
            Buffer.from([0x01, 0x02]),
        );
        avatarModel.prototype.save.mockRejectedValue(new Error());
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.getAvatar(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).not.toBeInstanceOf(HttpException);
        expect(err).toBeInstanceOf(Error);
    });

    it(`PayeverService.getAvatar - Mongo Entry Does Not Exist, and File System Fails to Store the Fetched Avatar - Throw Raw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        avatarModel.findOne.mockResolvedValue(null);
        reqresAdapter.getUser.mockResolvedValue({ data: { avatar: 'aa' } });
        reqresAdapter.downloadResource.mockResolvedValue(
            Buffer.from([0x01, 0x02]),
        );
        fileSystemAdapter.saveAvatar.mockRejectedValue(new Error());
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.getAvatar(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).not.toBeInstanceOf(HttpException);
        expect(err).toBeInstanceOf(Error);
    });

    it(`PayeverService.getAvatar - Everything Works as Expected - Fetch and Return the Avatar`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        avatarModel.findOne.mockResolvedValue(null);
        reqresAdapter.getUser.mockResolvedValue({
            data: { id: 1, avatar: 'aa' },
        });
        reqresAdapter.downloadResource.mockResolvedValue(
            Buffer.from([0x01, 0x02]),
        );
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err, result;

        // Act
        try {
            result = await payeverService.getAvatar(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).not.toBeDefined();
        expect(result[0]).toBe(Buffer.from([0x01, 0x02]).toString('base64'));
        expect(result[1]).toBe(false);
    });

    it(`PayeverService.deleteAvatar - Mongo Entry Does Not Exist - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        avatarModel.findOneAndDelete.mockResolvedValue(null);
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.deleteAvatar(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response).toBe(
            'Could not delete the avatar. It was not cached before.',
        );
    });

    it(`PayeverService.deleteAvatar - Mongo Entry Exists, but Avatar is Not Stored in the File System - Throw Raw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        avatarModel.findOneAndDelete.mockResolvedValue(1);
        fileSystemAdapter.deleteAvatar.mockRejectedValue(new Error());
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.deleteAvatar(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).not.toBeInstanceOf(HttpException);
        expect(err).toBeInstanceOf(Error);
    });

    it(`PayeverService.deleteAvatar - Everything Works as Expected - Delete the Avatar`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        avatarModel.findOneAndDelete.mockResolvedValue(1);
        payeverService = new PayeverService(
            messageQueue,
            userModel,
            avatarModel,
            mailAdapter,
            reqresAdapter,
            fileSystemAdapter,
        );
        let err;

        // Act
        try {
            await payeverService.deleteAvatar(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).not.toBeDefined();
    });
});
