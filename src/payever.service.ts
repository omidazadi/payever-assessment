import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import crypto from 'crypto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Avatar } from './schemas/avatar.schema';
import { MailerService } from './mailer.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PayeverService {
    constructor(
        @Inject('CONSUMER_SERVICE') private consumerClient: ClientProxy,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Avatar.name) private avatarModel: Model<Avatar>,
        private mailerService: MailerService,
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
        await createdUser.save();
        this.mailerService.notifyAdmin('New User!', `User ${id} just arrived!`);
        this.consumerClient.emit('UserCreate', createdUser);
    }

    public async retrieveUser(userId: number): Promise<User> {
        const result = await axios.get(`https://reqres.in/api/users/${userId}`);
        if (typeof result.data.data !== 'undefined') {
            const user = new this.userModel({
                id: result.data.data.id,
                email: result.data.data.email,
                firstName: result.data.data.first_name,
                lastName: result.data.data.last_name,
                avatarUrl: result.data.data.avatar,
            });

            return user;
        } else {
            throw new Error('Could not fetch the data from reqres.in');
        }
    }

    public async retrieveAndGetAvatar(userId: number): Promise<string> {
        const savedAvatar = await this.avatarModel.findOne({ userId: userId });
        if (savedAvatar !== null) {
            return savedAvatar.data.toString('base64');
        } else {
            const result = await axios.get(
                `https://reqres.in/api/users/${userId}`,
            );
            if (typeof result.data.data !== 'undefined') {
                const imageResult = await axios.get(result.data.data.avatar, {
                    responseType: 'arraybuffer',
                });
                if (typeof imageResult.data !== 'undefined') {
                    const hashSum = crypto.createHash('sha256');
                    hashSum.update(imageResult.data);
                    const createdAvater = new this.avatarModel({
                        userId: result.data.data.id,
                        hash: hashSum.digest('hex'),
                        data: imageResult.data,
                    });
                    await createdAvater.save();

                    return createdAvater.data.toString('base64');
                } else {
                    throw new Error('Could not fetch the avatar.');
                }
            } else {
                throw new Error('Could not fetch the data from reqres.in');
            }
        }
    }

    public async deleteAvatar(userId: number): Promise<void> {
        await this.avatarModel.findOneAndDelete({ userId: userId });
    }
}
