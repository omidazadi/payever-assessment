import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PayeverService } from './payever.service';
import { CreateUserBodyControllerReqDto } from './dtos/controller-req/create-user-body.controller-req-dto';
import { GetUserParamControllerReqDto } from './dtos/controller-req/get-user-param.controller-req-dto';
import { GetAvatarParamControllerReqDto } from './dtos/controller-req/get-avatar-param.controller-req-dto';
import { DeleteAvatarParamControllerReqDto } from './dtos/controller-req/delete-avatar-param.controller-req-dto';
import { GetUserControllerResDto } from './dtos/controller-res/get-user.controller-res-dto copy';
import { CreateUserControllerResDto } from './dtos/controller-res/create-user.controller-res-dto';
import { GetAvatarControllerResDto } from './dtos/controller-res/gat-avatar.controller-res-dto';
import { DeleteAvatarControllerResDto } from './dtos/controller-res/delete-avatar.controller-res-dto';

@Controller()
export class PayeverController {
    constructor(private readonly payeverService: PayeverService) {}

    @Post('api/users')
    public async createUser(
        @Body() body: CreateUserBodyControllerReqDto,
    ): Promise<CreateUserControllerResDto> {
        await this.payeverService.createUser(
            body.id,
            body.email,
            body.first_name,
            body.last_name,
            body.avatar,
        );
        return { ok: true };
    }

    @Get('api/user/:userId')
    public async getUser(
        @Param() param: GetUserParamControllerReqDto,
    ): Promise<GetUserControllerResDto> {
        const user = await this.payeverService.getUser(param.userId);
        return {
            id: user.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            avatar: user.avatarUrl,
        };
    }

    @Get('api/user/:userId/avatar')
    public async getAvatar(
        @Param() param: GetAvatarParamControllerReqDto,
    ): Promise<GetAvatarControllerResDto> {
        const [base64, cached] = await this.payeverService.getAvatar(
            param.userId,
        );
        return { base64: base64, cached: cached };
    }

    @Delete('api/user/:userId/avatar')
    public async deleteAvatar(
        @Param() param: DeleteAvatarParamControllerReqDto,
    ): Promise<DeleteAvatarControllerResDto> {
        await this.payeverService.deleteAvatar(param.userId);
        return { ok: true };
    }
}
