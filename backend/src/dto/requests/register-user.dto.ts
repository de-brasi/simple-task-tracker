import {IsIn, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "some@login"
    })
    public readonly login: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(["admin", "user"])
    @ApiProperty({
        enum: ["admin", "user"],
        default: "user"
    })
    public readonly role: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "some-very-strong-password"
    })
    public readonly password: string;
}