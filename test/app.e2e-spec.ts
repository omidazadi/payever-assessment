import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PayeverModule } from '../src/payever.module';

describe('AppController (e2e)', function () {
    let app: INestApplication;

    beforeAll(async function () {});

    beforeEach(async function () {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PayeverModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });
});
