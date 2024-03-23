import { instanceToPlain } from 'class-transformer';
import http from 'http';
import mockserver from 'mockserver';
import { ReqresAdapter } from 'src/adapters/reqres.adapter';
import { reqresConfig } from 'src/configs/reqres.config';
import { mockserverConfig } from '../configs/mockserver.config';

describe('[integration] Reqres Integration Tests', function () {
    let httpServer: http.Server;
    let reqresAdapter: ReqresAdapter;

    beforeAll(function () {
        httpServer = http
            .createServer(
                mockserver('test/integration/adapters/mockserver-mocks'),
            )
            .listen(mockserverConfig.port);
    });

    afterAll(async function () {
        httpServer.close();
    });

    // Basic Arrange
    beforeEach(async function () {
        reqresAdapter = new ReqresAdapter(reqresConfig);
    });

    it(`ReqresAdapter.getUser - Reqres Behaves Correctly - Get the User`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        let reqresUser, err;

        // Act
        try {
            reqresUser = await reqresAdapter.getUser(1);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(instanceToPlain(reqresUser)).toStrictEqual({
            data: {
                id: 1,
                email: 'azadiomid80@gmail.com',
                first_name: 'omid',
                last_name: 'azadi',
                avatar: 'google.com',
            },
            support: {
                text: 'Plz support me!',
                url: 'google.com',
            },
        });
        expect(err).not.toBeDefined();
    });

    it(`ReqresAdapter.getAvatar - Reqres Behaves Correctly - Get the Avatar`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        let avatar, err;

        // Act
        try {
            avatar = await reqresAdapter.downloadResource(
                `http://localhost:10001/img/faces/1-img.jpg`,
            );
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(avatar.toString('utf-8')).toBe('abcdef');
        expect(err).not.toBeDefined();
    });
});
