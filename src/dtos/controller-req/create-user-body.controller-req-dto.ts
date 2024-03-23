import { Expose } from 'class-transformer';
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
} from 'class-validator';

export class CreateUserBodyControllerReqDto {
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
