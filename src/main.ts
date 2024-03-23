import dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { PayeverModule } from './payever.module';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './configs/app.config';

async function bootstrap() {
    const app = await NestFactory.create(PayeverModule);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    await app.listen(appConfig.port);
}
bootstrap();
