import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AvatarDocument = HydratedDocument<Avatar>;

@Schema()
export class Avatar {
    @Prop({ required: true, unique: true })
    userId: number;

    @Prop({ required: true })
    hash: string;

    public constructor(userId: number, hash: string) {
        this.userId = userId;
        this.hash = hash;
    }
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
