import { lastValueFrom } from 'rxjs';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import amqplib from 'amqplib';
import { rmqConfig } from 'src/configs/rmq.config';
import { setTimeout } from 'timers/promises';

describe('[integration] RabbitMQ Integration Tests', function () {
    let messageQueue: ClientProxy;
    let rmqConnection: amqplib.Connection;
    let rmqChannel: amqplib.Channel;
    let emittedEvents: Array<any> = [];

    beforeAll(async function () {
        rmqConnection = await amqplib.connect(
            `amqp://${rmqConfig.host}:${rmqConfig.port}`,
        );
        rmqChannel = await rmqConnection.createChannel();
        await rmqChannel.assertQueue('Test');
        emittedEvents = [];
        rmqChannel.consume(
            'Test',
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
        await rmqChannel.close();
        await rmqConnection.close();
    });

    // Basic Arrange
    beforeEach(async function () {
        rmqChannel.ackAll();
        await setTimeout(1000);

        const moduleRef = await Test.createTestingModule({
            imports: [
                ClientsModule.register([
                    {
                        name: 'RMQ',
                        transport: Transport.RMQ,
                        options: {
                            urls: [
                                `amqp://${rmqConfig.host}:${rmqConfig.port}`,
                            ],
                            queue: 'Test',
                        },
                    },
                ]),
            ],
            controllers: [],
            providers: [],
        }).compile();

        messageQueue = moduleRef.get<ClientProxy>('RMQ');
    });

    it(`Conenctivity Test`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        let err;

        // Act
        try {
            await lastValueFrom(messageQueue.emit('123', 1));
        } catch (e: unknown) {
            err = e;
        }
        await setTimeout(1000);

        // Assert
        expect(emittedEvents).toHaveLength(1);
        expect(
            emittedEvents.map((emittedEvent) =>
                JSON.parse(emittedEvent.content.toString('utf-8')),
            ),
        ).toContainEqual({
            pattern: '123',
            data: 1,
        });
        expect(err).not.toBeDefined();
    });
});
