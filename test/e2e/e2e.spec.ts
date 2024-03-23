import fs from 'fs/promises';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import axios from 'axios';
import { expect } from '@jest/globals';
import { PayeverModule } from '../../src/payever.module';
import mongoose from 'mongoose';
import { mongoConfig } from '../../src/configs/mongo.config';
import amqplib from 'amqplib';
import { rmqConfig } from 'src/configs/rmq.config';
import { setTimeout } from 'timers/promises';
import { fileSystemConfig } from 'src/configs/file-system.config';
import { reqresConfig } from 'src/configs/reqres.config';
import { appConfig } from 'src/configs/app.config';

describe('[e2e] Application Tests', function () {
    let app: INestApplication;
    let mongooseConnection: mongoose.Connection;
    let rmqConnection: amqplib.Connection;
    let rmqChannel: amqplib.Channel;
    let emittedEvents: Array<amqplib.ConsumeMessage>;

    beforeAll(async function () {
        mongooseConnection = mongoose.createConnection(
            `mongodb://${mongoConfig.rootUsername}:${mongoConfig.rootPassword}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}?authSource=admin`,
        );
        rmqConnection = await amqplib.connect(
            `amqp://${rmqConfig.host}:${rmqConfig.port}`,
        );
        rmqChannel = await rmqConnection.createChannel();
        await rmqChannel.assertQueue('User');
        emittedEvents = [];
        rmqChannel.consume(
            'User',
            function (event: amqplib.ConsumeMessage | null) {
                if (event === null) {
                    return;
                }

                emittedEvents.push(event);
                rmqChannel.ack(event);
            },
        );
    });

    afterAll(async function () {
        await fs.rm(fileSystemConfig.avatarStoragePath, {
            recursive: true,
            force: true,
        });
        await mongooseConnection.close();
        await rmqChannel.close();
        await rmqConnection.close();
    });

    // Basic Arrange
    beforeEach(async function () {
        await fs.rm(fileSystemConfig.avatarStoragePath, {
            recursive: true,
            force: true,
        });
        await mongooseConnection.dropDatabase();
        rmqChannel.ackAll();
        await setTimeout(1000);
        emittedEvents = [];
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
        app.listen(appConfig.port);
    });

    afterEach(async function () {
        await app.close();
    });

    it('Scenario 1', async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const reqresGetUser = await axios.get(
            `${reqresConfig.baseUrl}/api/users/${10}`,
        );
        const reqresGetAvatar = await axios.get(
            `${reqresConfig.baseUrl}/img/faces/${10}-image.jpg`,
            { responseType: 'arraybuffer' },
        );

        // Act
        const payeverGetUser = await axios.get(
            `http://localhost:3000/api/user/${10}`,
        );
        await axios.post(
            `http://localhost:3000/api/users`,
            payeverGetUser.data,
        );
        await axios.post(`http://localhost:3000/api/users`, {
            id: 1,
            email: 'omidazadi@gmail.com',
            first_name: 'Omid.',
            last_name: 'Azadi',
            avatar: 'https://picsum.photos/id/1/200',
        });
        let payeverPostUser3Exception: any = null;
        try {
            await axios.post(`http://localhost:3000/api/users`, {
                id: 1,
                email: 'oazadi@outlook.com',
                first_name: 'Ali.',
                last_name: 'Meighani',
                avatar: 'https://google.com',
            });
        } catch (e: unknown) {
            payeverPostUser3Exception = e;
        }
        const payeverGetAvatar1 = await axios.get(
            `http://localhost:3000/api/user/${10}/avatar`,
        );
        const payeverGetAvatar2 = await axios.get(
            `http://localhost:3000/api/user/${10}/avatar`,
        );
        await axios.delete(`http://localhost:3000/api/user/${10}/avatar`);
        let payeverDeleteAvatar2Exception: any = null;
        try {
            await axios.delete(`http://localhost:3000/api/user/${10}/avatar`);
        } catch (e: unknown) {
            payeverDeleteAvatar2Exception = e;
        }
        await setTimeout(5000);

        // Assert
        expect(payeverGetUser.data).toStrictEqual(reqresGetUser.data.data);
        expect(payeverPostUser3Exception).not.toBe(null);
        expect(payeverPostUser3Exception.response.status).toBe(400);
        expect(payeverPostUser3Exception.response.data).toStrictEqual({
            statusCode: 400,
            message: 'User already exists.',
        });
        expect(payeverGetAvatar1.data.base64).toBe(
            payeverGetAvatar2.data.base64,
        );
        expect(payeverGetAvatar1.data.cached).toBe(false);
        expect(payeverGetAvatar2.data.cached).toBe(true);
        expect(payeverGetAvatar1.data.base64).toBe(
            reqresGetAvatar.data.toString('base64'),
        );
        expect(payeverDeleteAvatar2Exception).not.toBe(null);
        expect(payeverDeleteAvatar2Exception.response.status).toBe(400);
        expect(payeverDeleteAvatar2Exception.response.data).toStrictEqual({
            statusCode: 400,
            message: 'Could not delete the avatar. It was not cached before.',
        });
        expect(emittedEvents).toHaveLength(2);
        expect(
            emittedEvents.map((emittedEvent) =>
                JSON.parse(emittedEvent.content.toString('utf-8')),
            ),
        ).toContainEqual({
            pattern: 'UserCreated',
            data: { id: 10 },
        });
        expect(
            emittedEvents.map((emittedEvent) =>
                JSON.parse(emittedEvent.content.toString('utf-8')),
            ),
        ).toContainEqual({
            pattern: 'UserCreated',
            data: { id: 1 },
        });
    }, 100000);
});
