import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PayeverService } from './payever.service';
import { CreateUserBodyDto } from './dtos/create-user-body.dto';
import { User } from './schemas/user.schema';
import { GetUserParamDto } from './dtos/get-user-param.dto';
import { DeleteAvatarParamDto } from './dtos/delete-avatar-param.dto';
import { GetAvatarParamDto } from './dtos/get-avatar-param.dto';

@Controller()
export class PayeverController {
    constructor(private readonly payeverService: PayeverService) {}

    @Post('api/users')
    public async createUser(
        @Body() createUserBodyDto: CreateUserBodyDto,
    ): Promise<void> {
        await this.payeverService.createUser(
            createUserBodyDto.id,
            createUserBodyDto.email,
            createUserBodyDto.first_name,
            createUserBodyDto.last_name,
            createUserBodyDto.avatar,
        );
    }

    @Get('api/user/:userId')
    public async getUser(
        @Param() getUserParamDto: GetUserParamDto,
    ): Promise<User> {
        return await this.payeverService.retrieveUser(getUserParamDto.userId);
    }

    @Get('api/user/:userId/avatar')
    public async getAvatar(
        @Param() getAvatarParamDto: GetAvatarParamDto,
    ): Promise<string> {
        return await this.payeverService.retrieveAndGetAvatar(
            getAvatarParamDto.userId,
        );
    }

    @Delete('api/user/:userId/avatar')
    public async deleteAvatar(
        @Param() deleteAvatarParamDto: DeleteAvatarParamDto,
    ): Promise<void> {
        await this.payeverService.deleteAvatar(deleteAvatarParamDto.userId);
    }
}
