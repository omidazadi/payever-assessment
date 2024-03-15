import { Test, TestingModule } from '@nestjs/testing';
import { PayeverController } from './payever.controller';
import { PayeverService } from './payever.service';

describe('AppController', () => {
    let payeverController: PayeverController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [PayeverController],
            providers: [PayeverService],
        }).compile();

        payeverController = app.get<PayeverController>(PayeverController);
    });

    /*
    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.postUser()).resolves;
        });
    });
    */
});
