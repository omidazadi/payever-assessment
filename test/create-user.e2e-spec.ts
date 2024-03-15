import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import axios from 'axios';
import { expect } from '@jest/globals';
import { PayeverModule } from '../src/payever.module';
import mongoose from 'mongoose';
import { mongoConfig } from '../src/configs/mongo.config';
import { fail } from 'assert';
import { UserSchema } from '../src/schemas/user.schema';

describe('Create User (e2e)', () => {
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

    it('POST /api/users - Functionality Test', async function () {
        const firstRequest = await axios.post(
            'http://localhost:3000/api/users',
            {
                id: 122,
                email: 'azadiomid80@gmail.com',
                first_name: 'Omid',
                last_name: 'Azadi',
                avatar: 'https://google.com',
            },
        );
        expect(firstRequest.status).toBe(201);
        expect(firstRequest.data).toBe('');

        const secondRequest = await axios.post(
            'http://localhost:3000/api/users',
            {
                id: 123,
                email: 'ameighani@outlook.com',
                first_name: 'Ali',
                last_name: 'Meighani',
                avatar: 'https://omgomgomg.com',
            },
        );
        expect(secondRequest.status).toBe(201);
        expect(secondRequest.data).toBe('');

        let flag = false;
        try {
            await axios.post('http://localhost:3000/api/users', {
                id: 122,
                email: 'xxx@gmail.com',
                first_name: 'Mr.',
                last_name: 'Robot',
                avatar: 'https://badbadbad.org',
            });
            flag = true;
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (typeof e.response !== 'undefined') {
                    expect(e.response.status).toBe(400);
                } else {
                    fail('Duplicate id request did not get a response.');
                }
            } else {
                fail('Duplicate id request failed unexpectedly.');
            }
        }
        if (flag === true) {
            fail('Duplicate id request did not fail.');
        }

        flag = false;
        try {
            await axios.post('http://localhost:3000/api/users', {
                id: 123,
                email: 'xxx@gmail.com',
                first_name: 'Mr.',
                last_name: 'Robot',
                avatar: 'https://badbadbad.org',
            });
            flag = true;
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (typeof e.response !== 'undefined') {
                    expect(e.response.status).toBe(400);
                } else {
                    fail('Duplicate id request did not get a response.');
                }
            } else {
                fail('Duplicate id request failed unexpectedly.');
            }
        }
        if (flag === true) {
            fail('Duplicate id request did not fail.');
        }

        const userModel = mongooseConnection.model('users', UserSchema);
        const user1 = await userModel.findOne({ id: 122 });
        if (user1 === null) {
            fail('User is not saved to the database.');
        }
        expect(user1.id).toBe(122);
        expect(user1.email).toBe('azadiomid80@gmail.com');
        expect(user1.firstName).toBe('Omid');
        expect(user1.lastName).toBe('Azadi');
        expect(user1.avatarUrl).toBe('https://google.com');

        const user2 = await userModel.findOne({ id: 123 });
        if (user2 === null) {
            fail('User is not saved to the database.');
        }
        expect(user2.id).toBe(123);
        expect(user2.email).toBe('ameighani@outlook.com');
        expect(user2.firstName).toBe('Ali');
        expect(user2.lastName).toBe('Meighani');
        expect(user2.avatarUrl).toBe('https://omgomgomg.com');
    });

    it('POST /api/users - Invalid ID Validation Test', async function () {
        let flag = false;
        try {
            await axios.post('http://localhost:3000/api/users', {
                id: 1001,
                email: 'xxx@gmail.com',
                first_name: 'Mr.',
                last_name: 'Robot',
                avatar: 'https://badbadbad.org',
            });
            flag = true;
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (typeof e.response !== 'undefined') {
                    expect(e.response.status).toBe(400);
                } else {
                    fail('Invalid id request did not get a response.');
                }
            } else {
                fail('Invalid id request failed unexpectedly.');
            }
        }
        if (flag === true) {
            fail('Invalid id request did not fail.');
        }
    });

    it('POST /api/users - Invalid Email Validation Test', async function () {
        let flag = false;
        try {
            await axios.post('http://localhost:3000/api/users', {
                id: 1,
                email: 'xxx',
                first_name: 'Mr.',
                last_name: 'Robot',
                avatar: 'https://badbadbad.org',
            });
            flag = true;
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (typeof e.response !== 'undefined') {
                    expect(e.response.status).toBe(400);
                } else {
                    fail('Invalid email request did not get a response.');
                }
            } else {
                fail('Invalid email request failed unexpectedly.');
            }
        }
        if (flag === true) {
            fail('Invalid email request did not fail.');
        }
    });

    it('POST /api/users - Invalid First Name Validation Test', async function () {
        let flag = false;
        try {
            await axios.post('http://localhost:3000/api/users', {
                id: 1,
                email: 'xxx@gmail.com',
                first_name: 'M',
                last_name: 'Robot',
                avatar: 'https://badbadbad.org',
            });
            flag = true;
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (typeof e.response !== 'undefined') {
                    expect(e.response.status).toBe(400);
                } else {
                    fail('Invalid first name request did not get a response.');
                }
            } else {
                fail('Invalid first name request failed unexpectedly.');
            }
        }
        if (flag === true) {
            fail('Invalid first name request did not fail.');
        }
    });

    it('POST /api/users - Invalid Last Name Validation Test', async function () {
        let flag = false;
        try {
            await axios.post('http://localhost:3000/api/users', {
                id: 1,
                email: 'xxx@gmail.com',
                first_name: 'Mr.',
                last_name: 'Ro',
                avatar: 'https://badbadbad.org',
            });
            flag = true;
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (typeof e.response !== 'undefined') {
                    expect(e.response.status).toBe(400);
                } else {
                    fail('Invalid last name request did not get a response.');
                }
            } else {
                fail('Invalid last name request failed unexpectedly.');
            }
        }
        if (flag === true) {
            fail('Invalid last name request did not fail.');
        }
    });

    it('POST /api/users - Invalid Avatar Validation Test', async function () {
        let flag = false;
        try {
            await axios.post('http://localhost:3000/api/users', {
                id: 1,
                email: 'xxx@gmail.com',
                first_name: 'Mr.',
                last_name: 'Robot',
                avatar: 'https',
            });
            flag = true;
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (typeof e.response !== 'undefined') {
                    expect(e.response.status).toBe(400);
                } else {
                    fail('Invalid avatar name request did not get a response.');
                }
            } else {
                fail('Invalid avatar name request failed unexpectedly.');
            }
        }
        if (flag === true) {
            fail('Invalid avatar name request did not fail.');
        }
    });
});
