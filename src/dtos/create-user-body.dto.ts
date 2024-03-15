import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsUrl,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

export class CreateUserBodyDto {
    @Min(1)
    @Max(1000)
    @IsNumber()
    @IsNotEmpty()
    public id: number;

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @MinLength(1)
    @MaxLength(32)
    @IsNotEmpty()
    public first_name: string;

    @MinLength(1)
    @MaxLength(32)
    @IsNotEmpty()
    public last_name: string;

    @IsUrl()
    @IsNotEmpty()
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
