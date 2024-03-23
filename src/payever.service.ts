import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import crypto from 'crypto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Avatar } from './schemas/avatar.schema';
import { ClientProxy } from '@nestjs/microservices';
import { MailAdapter } from './adapters/mail.adapter';
import { ReqresAdapter } from './adapters/reqres.adapter';
import { FileSystemAdapter } from './adapters/file-system.adapter';
import { GetUserReqresResDto } from './dtos/reqres-res/get-user.reqres-res-dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PayeverService {
    constructor(
        @Inject('RMQ') private messageQueue: ClientProxy,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Avatar.name) private avatarModel: Model<Avatar>,
        private mailAdapter: MailAdapter,
        private reqresAdapter: ReqresAdapter,
        private fileSystemAdapter: FileSystemAdapter,
    ) {}

    public async createUser(
        id: number,
        email: string,
        firstName: string,
        lastName: string,
        avatarUrl: string,
    ): Promise<void> {
        const createdUser = new this.userModel({
            id: id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            avatarUrl: avatarUrl,
        });

        try {
            await createdUser.save();
        } catch (e: unknown) {
            if (
                e !== null &&
                typeof e === 'object' &&
                'code' in e &&
                e.code === 11000
            ) {
                throw new HttpException(
                    'User already exists.',
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                throw new HttpException(
                    'Could not proceed with the request.',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        try {
            await this.mailAdapter.notifyAdmin(
                'New User!',
                `User ${id} just arrived!`,
            );
        } catch (e: unknown) {
            throw new HttpException(
                'Could not proceed with the request.',
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            const eventsObservable = this.messageQueue.emit('UserCreated', {
                id: id,
            });
            await lastValueFrom(eventsObservable);
        } catch (e: unknown) {
            throw new HttpException(
                'Could not proceed with the request.',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    public async getUser(userId: number): Promise<User> {
        try {
            const reqresUser = await this.reqresAdapter.getUser(userId);
            return new this.userModel({
                id: reqresUser.data.id,
                email: reqresUser.data.email,
                firstName: reqresUser.data.first_name,
                lastName: reqresUser.data.last_name,
                avatarUrl: reqresUser.data.avatar,
            });
        } catch (e: unknown) {
            throw new HttpException(
                'Could not proceed with the request.',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    public async getAvatar(userId: number): Promise<[string, boolean]> {
        const savedAvatar = await this.avatarModel.findOne({ userId: userId });
        if (savedAvatar !== null) {
            try {
                return [
                    (
                        await this.fileSystemAdapter.getAvatar(
                            savedAvatar.userId.toString(),
                        )
                    ).toString('base64'),
                    true,
                ];
            } catch (e: unknown) {
                throw new HttpException(
                    'Internal Server Error.',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        } else {
            let reqresUser: GetUserReqresResDto;
            let image: Buffer;

            try {
                reqresUser = await this.reqresAdapter.getUser(userId);
                image = await this.reqresAdapter.downloadResource(
                    reqresUser.data.avatar,
                );
            } catch (e: unknown) {
                throw new HttpException(
                    'Could not proceed with the request.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const hashSum = crypto.createHash('sha256');
            hashSum.update(image);
            const createdAvater = new this.avatarModel({
                userId: reqresUser.data.id,
                hash: hashSum.digest('hex'),
            });
            await createdAvater.save();
            await this.fileSystemAdapter.saveAvatar(
                reqresUser.data.id.toString(),
                image,
            );
            return [image.toString('base64'), false];
        }
    }

    public async deleteAvatar(userId: number): Promise<void> {
        const avatar = await this.avatarModel.findOneAndDelete({
            userId: userId,
        });
        if (avatar !== null) {
            await this.fileSystemAdapter.deleteAvatar(userId.toString());
        } else {
            throw new HttpException(
                'Could not delete the avatar. It was not cached before.',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
