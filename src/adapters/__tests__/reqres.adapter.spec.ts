import { ReqresConfig } from 'src/configs/reqres.config';
import { ReqresAdapter } from '../reqres.adapter';
import { instanceToPlain } from 'class-transformer';

/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('axios');
const axios = require('axios');

describe('[unit] ReqresAdapter Tests', function () {
    let reqresConfig: ReqresConfig;
    let reqresAdapter: ReqresAdapter;

    beforeAll(function () {
        reqresConfig = new ReqresConfig({ baseUrl: 'https://aaa.com' });
        reqresAdapter = new ReqresAdapter(reqresConfig);
    });

    // Basic Arrange
    beforeEach(async function () {
        jest.clearAllMocks();
    });

    it(`ReqresAdapter.getUser - Reqres is Not Responding - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        axios.get.mockImplementation(async function (url: string) {
            url;
            throw new Error();
        });
        let err;

        // Act
        try {
            await reqresAdapter.getUser(10);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(axios.get.mock.calls).toHaveLength(1);
        expect(axios.get.mock.calls[0][0]).toBe('https://aaa.com/api/users/10');
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Reqres Adapter: Could not fetch reqres.');
    });

    it(`ReqresAdapter.getUser - Reqres Responds with Invalid Data 1 - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        axios.get.mockResolvedValue({
            data: {
                data: {
                    id: '10',
                    email: 'azadiomid80@gmail.com',
                    first_name: 'omid',
                    last_name: 'azadi',
                    avatar: 'google.com',
                },
                support: {
                    text: 'Plz support me!',
                    url: 'google.com',
                },
            },
        });
        let err;

        // Act
        try {
            await reqresAdapter.getUser(10);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(axios.get.mock.calls).toHaveLength(1);
        expect(axios.get.mock.calls[0][0]).toBe('https://aaa.com/api/users/10');
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(
            'Reqres Adapter: Unexpected response from reqres.',
        );
    });

    it(`ReqresAdapter.getUser - Reqres Responds with Invalid Data 2 - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        axios.get.mockResolvedValue({
            data: {
                data: {
                    xxx: 1,
                },
                support: {
                    yyy: 2,
                },
            },
        });
        let err;

        // Act
        try {
            await reqresAdapter.getUser(10);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(axios.get.mock.calls).toHaveLength(1);
        expect(axios.get.mock.calls[0][0]).toBe('https://aaa.com/api/users/10');
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(
            'Reqres Adapter: Unexpected response from reqres.',
        );
    });

    it(`ReqresAdapter.getUser - Reqres Responds with Invalid Data 3 - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        axios.get.mockResolvedValue({
            data: {
                xxx: 1,
            },
        });
        let err;

        // Act
        try {
            await reqresAdapter.getUser(10);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(axios.get.mock.calls).toHaveLength(1);
        expect(axios.get.mock.calls[0][0]).toBe('https://aaa.com/api/users/10');
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(
            'Reqres Adapter: Unexpected response from reqres.',
        );
    });

    it(`ReqresAdapter.getUser - Reqres Responds with Invalid Data 4 - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        axios.get.mockResolvedValue({});
        let err;

        // Act
        try {
            await reqresAdapter.getUser(10);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(axios.get.mock.calls).toHaveLength(1);
        expect(axios.get.mock.calls[0][0]).toBe('https://aaa.com/api/users/10');
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(
            'Reqres Adapter: Unexpected response from reqres.',
        );
    });

    it(`ReqresAdapter.getUser - Reqres Behaves Correctly - Get the User`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        const data = {
            data: {
                data: {
                    id: 10,
                    email: 'azadiomid80@gmail.com',
                    first_name: 'omid',
                    last_name: 'azadi',
                    avatar: 'google.com',
                },
                support: {
                    text: 'Plz support me!',
                    url: 'google.com',
                },
            },
        };
        axios.get.mockResolvedValue(data);
        let err, user;

        // Act
        try {
            user = await reqresAdapter.getUser(10);
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(axios.get.mock.calls).toHaveLength(1);
        expect(axios.get.mock.calls[0][0]).toBe('https://aaa.com/api/users/10');
        expect(err).not.toBeDefined();
        expect(instanceToPlain(user)).toStrictEqual(data.data);
    });

    it(`ReqresAdapter.downloadResource - Reqres is Not Responding - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        axios.get.mockImplementation(async function (url: string) {
            url;
            throw new Error();
        });
        let err;

        // Act
        try {
            await reqresAdapter.downloadResource('google.com');
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(axios.get.mock.calls).toHaveLength(1);
        expect(axios.get.mock.calls[0][0]).toBe('google.com');
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Reqres Adapter: Could not fetch reqres.');
    });

    it(`ReqresAdapter.downloadResource - Reqres Responds with Invalid Data - Throw Exception`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        axios.get.mockResolvedValue({});
        let err;

        // Act
        try {
            await reqresAdapter.downloadResource('google.com');
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(axios.get.mock.calls).toHaveLength(1);
        expect(axios.get.mock.calls[0][0]).toBe('google.com');
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(
            'Reqres Adapter: Unexpected response from reqres.',
        );
    });

    it(`ReqresAdapter.downloadResource - Reqres Behaves Correctle - Download the Resource`, async function () {
        // Arrange
        // Basic Arrange is done in beforeEach
        axios.get.mockResolvedValue({ data: Buffer.from('xxx', 'utf-8') });
        let err, data;

        // Act
        try {
            data = await reqresAdapter.downloadResource('google.com');
        } catch (e: unknown) {
            err = e;
        }

        // Assert
        expect(axios.get.mock.calls).toHaveLength(1);
        expect(axios.get.mock.calls[0][0]).toBe('google.com');
        expect(err).not.toBeDefined();
        expect(data).toStrictEqual(Buffer.from('xxx', 'utf-8'));
    });
});
