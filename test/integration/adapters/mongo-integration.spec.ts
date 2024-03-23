import { Test } from '@nestjs/testing';
import { setTimeout } from 'timers/promises';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { mongoConfig } from 'src/configs/mongo.config';
import { User, UserSchema } from 'src/schemas/user.schema';
import mongoose, { Model } from 'mongoose';

describe('[integration] MongoDB Integration Tests', function () {
    let mongooseConnection: mongoose.Connection;
    let userModel: Model<User>;

    beforeAll(async function () {
        mongooseConnection = mongoose.createConnection(
            `mongodb://${mongoConfig.rootUsername}:${mongoConfig.rootPassword}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}?authSource=admin`,
        );
    });

    afterAll(async function () {
        await mongooseConnection.close();
    });

    // Basic Arrange
    beforeEach(async function () {
        await mongooseConnection.dropDatabase();

        const moduleRef = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(
                    `mongodb://${mongoConfig.rootUsername}:${mongoConfig.rootPassword}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}?authSource=admin`,
                ),
                MongooseModule.forFeature([
                    { name: User.name, schema: UserSchema },
                ]),
            ],
            controllers: [],
            providers: [],
        }).compile();

        userModel = moduleRef.get<Model<User>>(getModelToken(User.name));
    });

    it(`Conenctivity Test`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        let user1, user2, err;

        // Act
        try {
            user1 = new userModel({
                id: 1,
                firstName: 'Omid',
                lastName: 'Azadi',
                email: 'azadiomid80@gmail.com',
                avatarUrl: 'google.com',
            });
            await user1.save();
            user2 = await userModel.findOne({ id: 1 });
        } catch (e: unknown) {
            err = e;
        }
        await setTimeout(1000);

        // Assert
        expect(user1.id).toBe(user2.id);
        expect(user1.firstName).toBe(user2.firstName);
        expect(user1.lastName).toBe(user2.lastName);
        expect(user1.email).toBe(user2.email);
        expect(user1.avatarUrl).toBe(user2.avatarUrl);
        expect(err).not.toBeDefined();
    }, 10000);
});
