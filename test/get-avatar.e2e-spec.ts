import { INestApplication, ValidationPipe } from '@nestjs/common';
import mongoose from 'mongoose';
import { mongoConfig } from '../src/configs/mongo.config';
import { Test, TestingModule } from '@nestjs/testing';
import { PayeverModule } from '../src/payever.module';
import axios from 'axios';
import crypto from 'crypto';
import { AvatarSchema } from '../src/schemas/avatar.schema';

describe('Get Avatar (e2e)', () => {
    let app: INestApplication;
    let mongooseConnection: mongoose.Connection;

    beforeAll(async function () {
        mongooseConnection = mongoose.createConnection(
            `mongodb://${mongoConfig.rootUsername}:${mongoConfig.rootPassword}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}?authSource=admin`,
        );
    });

    afterAll(async function () {
        await mongooseConnection.close();
    });

    beforeEach(async function () {
        await mongooseConnection.dropDatabase();
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PayeverModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
            }),
        );
        await app.init();
        app.listen(3000);
    });

    afterEach(async function () {
        await app.close();
    });

    it('GET /api/user/:userId/avatar - Functionality Test', async function () {
        const originalRequest = await axios.get(
            'https://reqres.in/api/users/1',
        );
        const originalAvatarRequest = await axios.get(
            originalRequest.data.data.avatar,
            {
                responseType: 'arraybuffer',
            },
        );
        const payeverAvatarRequest = await axios.get(
            'http://localhost:3000/api/user/1/avatar',
        );
        expect(payeverAvatarRequest.status).toBe(200);
        expect(payeverAvatarRequest.data).toBe(
            originalAvatarRequest.data.toString('base64'),
        );

        const avatarModel = mongooseConnection.model('avatars', AvatarSchema);
        const user = await avatarModel.findOne({ userId: 1 });
        if (user === null) {
            fail('Avatar is not saved to the database.');
        }
        expect(user.userId).toBe(1);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(originalAvatarRequest.data);
        expect(user.hash).toBe(hashSum.digest('hex'));
        expect(user.data.toString('base64')).toBe(payeverAvatarRequest.data);
    });

    it('GET /api/user/:userId/avatar - Invalid User ID Validation Test', async function () {
        let flag = false;
        try {
            await axios.get('http://localhost:3000/api/user/1001/avatar');
            flag = true;
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (typeof e.response !== 'undefined') {
                    expect(e.response.status).toBe(400);
                } else {
                    fail('Invalid User ID request did not get a response.');
                }
            } else {
                fail('Invalid User ID request failed unexpectedly.');
            }
        }
        if (flag === true) {
            fail('Invalid User ID request did not fail.');
        }
    });
});
