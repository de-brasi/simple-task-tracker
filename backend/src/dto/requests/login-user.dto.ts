import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "your@login"
    })
    public readonly login: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "your-password"
    })
    public readonly password: string;
}