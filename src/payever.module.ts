import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PayeverController } from './payever.controller';
import { PayeverService } from './payever.service';
import { User, UserSchema } from './schemas/user.schema';
import { Avatar, AvatarSchema } from './schemas/avatar.schema';
import { MailerConfig, mailerConfig } from './configs/mailer.config';
import { MailerService } from './mailer.service';
import { mongoConfig } from './configs/mongo.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { rmqConfig } from './configs/rmq.config';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'CONSUMER_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [`amqp://${rmqConfig.host}:${rmqConfig.port}`],
                    queue: 'User',
                },
            },
        ]),
        MongooseModule.forRoot(
            `mongodb://${mongoConfig.rootUsername}:${mongoConfig.rootPassword}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}?authSource=admin`,
        ),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([
            { name: Avatar.name, schema: AvatarSchema },
        ]),
    ],
    controllers: [PayeverController],
    providers: [
        PayeverService,
        MailerService,
        {
            provide: MailerConfig,
            useValue: mailerConfig,
        },
    ],
})
export class PayeverModule {}
