import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PayeverController } from './payever.controller';
import { PayeverService } from './payever.service';
import { User, UserSchema } from './schemas/user.schema';
import { Avatar, AvatarSchema } from './schemas/avatar.schema';
import { MailConfig, mailConfig } from './configs/mail.config';
import { mongoConfig } from './configs/mongo.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { rmqConfig } from './configs/rmq.config';
import {
    FileSystemConfig,
    fileSystemConfig,
} from './configs/file-system.config';
import { MailAdapter } from './adapters/mail.adapter';
import { ReqresAdapter } from './adapters/reqres.adapter';
import { FileSystemAdapter } from './adapters/file-system.adapter';
import { ReqresConfig, reqresConfig } from './configs/reqres.config';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'RMQ',
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
        MailAdapter,
        ReqresAdapter,
        FileSystemAdapter,
        {
            provide: MailConfig,
            useValue: mailConfig,
        },
        {
            provide: FileSystemConfig,
            useValue: fileSystemConfig,
        },
        {
            provide: ReqresConfig,
            useValue: reqresConfig,
        },
    ],
})
export class PayeverModule {}
