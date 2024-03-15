import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AvatarDocument = HydratedDocument<Avatar>;

@Schema()
export class Avatar {
    @Prop({ required: true, unique: true })
    userId: number;

    @Prop({ required: true })
    hash: string;

    @Prop({ required: true })
    data: Buffer;

    public constructor(userId: number, hash: string, data: Buffer) {
        this.userId = userId;
        this.hash = hash;
        this.data = data;
    }
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
