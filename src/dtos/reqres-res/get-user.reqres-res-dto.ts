import { Expose, Type } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsUrl,
    Max,
    MaxLength,
    Min,
    MinLength,
    ValidateNested,
} from 'class-validator';

class GetUserReqresResData {
    @Min(1)
    @Max(1000)
    @IsNumber()
    @IsNotEmpty()
    @Expose()
    public id: number;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @Expose()
    public email: string;

    @MinLength(3)
    @MaxLength(32)
    @IsString()
    @IsNotEmpty()
    @Expose()
    public first_name: string;

    @MinLength(3)
    @MaxLength(32)
    @IsString()
    @IsNotEmpty()
    @Expose()
    public last_name: string;

    @IsUrl()
    @IsString()
    @IsNotEmpty()
    @Expose()
    public avatar: string;

    public constructor(
        id: number,
        email: string,
        first_name: string,
        last_name: string,
        avatar: string,
    ) {
        this.id = id;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.avatar = avatar;
    }
}

class GetUserReqresResSupport {
    @IsUrl()
    @IsString()
    @IsNotEmpty()
    @Expose()
    public url: string;

    @MaxLength(10000)
    @IsString()
    @IsNotEmpty()
    @Expose()
    public text: string;

    public constructor(url: string, text: string) {
        this.url = url;
        this.text = text;
    }
}

export class GetUserReqresResDto {
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => GetUserReqresResData)
    @Expose()
    public data: GetUserReqresResData;

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => GetUserReqresResSupport)
    @Expose()
    public support: GetUserReqresResSupport;

    public constructor(
        data: GetUserReqresResData,
        support: GetUserReqresResSupport,
    ) {
        this.data = data;
        this.support = support;
    }
}
