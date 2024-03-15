import { INestApplication, ValidationPipe } from '@nestjs/common';
import mongoose from 'mongoose';
import { mongoConfig } from '../src/configs/mongo.config';
import { Test, TestingModule } from '@nestjs/testing';
import { PayeverModule } from '../src/payever.module';
import axios from 'axios';

describe('Get User (e2e)', () => {
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

    it('GET /api/user/:userId - Functionality Test', async function () {
        const firstRequest = await axios.get(
            'http://localhost:3000/api/user/1',
        );
        expect(firstRequest.status).toBe(200);
        expect(firstRequest.data.id).toBe(1);
        expect(firstRequest.data.email).toBe('george.bluth@reqres.in');
        expect(firstRequest.data.firstName).toBe('George');
        expect(firstRequest.data.lastName).toBe('Bluth');
        expect(firstRequest.data.avatarUrl).toBe(
            'https://reqres.in/img/faces/1-image.jpg',
        );

        const secondRequest = await axios.get(
            'http://localhost:3000/api/user/10',
        );
        expect(secondRequest.status).toBe(200);
        expect(secondRequest.data.id).toBe(10);
        expect(secondRequest.data.email).toBe('byron.fields@reqres.in');
        expect(secondRequest.data.firstName).toBe('Byron');
        expect(secondRequest.data.lastName).toBe('Fields');
        expect(secondRequest.data.avatarUrl).toBe(
            'https://reqres.in/img/faces/10-image.jpg',
        );
    });

    it('GET /api/user/:userId - Invalid User ID Validation Test', async function () {
        let flag = false;
        try {
            await axios.get('http://localhost:3000/api/user/1001');
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
