import {ApiProperty} from "@nestjs/swagger";

export class LoginResponseDto {
    @ApiProperty({description: 'Authenticated user\'s token'})
    public readonly token: string;

    @ApiProperty({description: 'Authenticated user\'s id'})
    public readonly id: number;

    constructor(token: string, id: number) {
        this.token = token;
        this.id = id;
    }
}