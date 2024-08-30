import {ApiProperty} from "@nestjs/swagger";

export class LoginResponseDto {
    @ApiProperty({description: 'Authenticated user token'})
    public readonly token: string;

    constructor(token: string) {
        this.token = token;
    }
}