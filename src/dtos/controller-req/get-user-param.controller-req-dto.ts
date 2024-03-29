import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class GetUserParamControllerReqDto {
    @Transform(function (option: { value: string }) {
        return parseInt(option.value);
    })
    @Min(1)
    @Max(1000)
    @IsNumber()
    @IsNotEmpty()
    @Expose()
    public userId: number;

    public constructor(userId: number) {
        this.userId = userId;
    }
}
