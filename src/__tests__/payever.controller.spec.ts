import { CreateUserBodyControllerReqDto } from 'src/dtos/controller-req/create-user-body.controller-req-dto';
import { DeleteAvatarParamControllerReqDto } from 'src/dtos/controller-req/delete-avatar-param.controller-req-dto';
import { GetAvatarParamControllerReqDto } from 'src/dtos/controller-req/get-avatar-param.controller-req-dto';
import { GetUserParamControllerReqDto } from 'src/dtos/controller-req/get-user-param.controller-req-dto';
import { PayeverController } from 'src/payever.controller';

/* eslint-disable @typescript-eslint/no-var-requires */
let PayeverService = require('../payever.service');

describe('[unit] PayeverController Tests', function () {
    let payeverController: PayeverController;
    let payeverService: any;

    // Basic Arrange
    beforeEach(async function () {
        PayeverService = jest.fn();
        PayeverService.prototype.createUser = jest.fn();
        PayeverService.prototype.getUser = jest.fn();
        PayeverService.prototype.getAvatar = jest.fn();
        PayeverService.prototype.deleteAvatar = jest.fn();
        payeverService = new PayeverService();
        jest.clearAllMocks();
    });

    it(`PayeverController.createUser - PayeverService Throws an Exception - Respond with the Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const payeverServiceError = new Error('Lalala');
        payeverService.createUser.mockRejectedValue(payeverServiceError);
        payeverController = new PayeverController(payeverService);
        let err;

        // Act
        try {
            await payeverController.createUser(
                new CreateUserBodyControllerReqDto(
                    1,
                    'azadiomid80@gmail.com',
                    'Omid',
                    'Azadi',
                    'google.com',
                ),
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toStrictEqual(payeverServiceError);
    });

    it(`PayeverController.createUser - PayeverService Works Correctly - Respond with Success`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        payeverController = new PayeverController(payeverService);
        let err, res;

        // Act
        try {
            res = await payeverController.createUser(
                new CreateUserBodyControllerReqDto(
                    1,
                    'azadiomid80@gmail.com',
                    'Omid',
                    'Azadi',
                    'google.com',
                ),
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).not.toBeDefined();
        expect(res).toStrictEqual({ ok: true });
    });

    it(`PayeverController.getUser - PayeverService Throws an Exception - Respond with the Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const payeverServiceError = new Error('Lalala');
        payeverService.getUser.mockRejectedValue(payeverServiceError);
        payeverController = new PayeverController(payeverService);
        let err;

        // Act
        try {
            await payeverController.getUser(
                new GetUserParamControllerReqDto(1),
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toStrictEqual(payeverServiceError);
    });

    it(`PayeverController.getUser - PayeverService Works Correctly - Respond with Success`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const payeverServiceResponse = {
            id: 1,
            email: 'azadiomid80@gmail.com',
            firstName: 'Omid',
            lastName: 'Azadi',
            avatarUrl: 'google.com',
        };
        payeverService.getUser.mockResolvedValue(payeverServiceResponse);
        payeverController = new PayeverController(payeverService);
        let err, res;

        // Act
        try {
            res = await payeverController.getUser(
                new GetUserParamControllerReqDto(1),
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).not.toBeDefined();
        expect(res).toStrictEqual({
            id: 1,
            email: 'azadiomid80@gmail.com',
            first_name: 'Omid',
            last_name: 'Azadi',
            avatar: 'google.com',
        });
    });

    it(`PayeverController.getAvatar - PayeverService Throws an Exception - Respond with the Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const payeverServiceError = new Error('Lalala');
        payeverService.getAvatar.mockRejectedValue(payeverServiceError);
        payeverController = new PayeverController(payeverService);
        let err;

        // Act
        try {
            await payeverController.getAvatar(
                new GetUserParamControllerReqDto(1),
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toStrictEqual(payeverServiceError);
    });

    it(`PayeverController.getAvatar - PayeverService Works Correctly - Respond with Success`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const payeverServiceResponse = ['AaaBa', false];
        payeverService.getAvatar.mockResolvedValue(payeverServiceResponse);
        payeverController = new PayeverController(payeverService);
        let err, res;

        // Act
        try {
            res = await payeverController.getAvatar(
                new GetAvatarParamControllerReqDto(1),
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).not.toBeDefined();
        expect(res).toStrictEqual({
            base64: 'AaaBa',
            cached: false,
        });
    });

    it(`PayeverController.deleteAvatar - PayeverService Throws an Exception - Respond with the Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const payeverServiceError = new Error('Lalala');
        payeverService.deleteAvatar.mockRejectedValue(payeverServiceError);
        payeverController = new PayeverController(payeverService);
        let err;

        // Act
        try {
            await payeverController.deleteAvatar(
                new DeleteAvatarParamControllerReqDto(1),
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).toStrictEqual(payeverServiceError);
    });

    it(`PayeverController.deleteAvatar - PayeverService Works Correctly - Respond with Success`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        payeverController = new PayeverController(payeverService);
        let err, res;

        // Act
        try {
            res = await payeverController.deleteAvatar(
                new DeleteAvatarParamControllerReqDto(1),
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(err).not.toBeDefined();
        expect(res).toStrictEqual({
            ok: true,
        });
    });
});
