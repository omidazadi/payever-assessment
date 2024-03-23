import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GetUserReqresResDto } from '../dtos/reqres-res/get-user.reqres-res-dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ReqresConfig } from 'src/configs/reqres.config';

@Injectable()
export class ReqresAdapter {
    public constructor(private reqresConfig: ReqresConfig) {}

    public async getUser(userId: number): Promise<GetUserReqresResDto> {
        let transformedData: GetUserReqresResDto | null = null;

        try {
            const axiosResult = await axios.get(
                `${this.reqresConfig.baseUrl}/api/users/${userId}`,
            );
            if (typeof axiosResult.data !== 'undefined') {
                transformedData = plainToInstance(
                    GetUserReqresResDto,
                    axiosResult.data as unknown,
                );
                const validationErrors = validateSync(transformedData);
                if (validationErrors.length > 0) {
                    transformedData = null;
                }
            }
        } catch (e: unknown) {
            throw new Error('Reqres Adapter: Could not fetch reqres.');
        }

        if (transformedData === null) {
            throw new Error('Reqres Adapter: Unexpected response from reqres.');
        }

        return transformedData;
    }

    public async downloadResource(url: string): Promise<Buffer> {
        let data: Buffer | null = null;

        try {
            const axiosResult = await axios.get(url, {
                responseType: 'arraybuffer',
            });
            if (
                typeof axiosResult.data !== 'undefined' &&
                Buffer.isBuffer(axiosResult.data)
            ) {
                data = axiosResult.data;
            }
        } catch (e: unknown) {
            throw new Error('Reqres Adapter: Could not fetch reqres.');
        }

        if (data === null) {
            throw new Error('Reqres Adapter: Unexpected response from reqres.');
        }

        return data;
    }
}
