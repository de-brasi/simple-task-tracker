import {Body, Controller, Post} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RegisterUserDto} from "../dto/requests/register-user.dto";
import {AuthService} from "./auth.service";
import {LoginUserDto} from "../dto/requests/login-user.dto";
import {LoginResponseDto} from "../dto/responses/login-response.dto";

@Controller('api/user')
@ApiTags('Пользователи')
export class AuthController {
    constructor(
        private readonly usersService: AuthService
    ) {
    }

    @ApiOperation({'summary': 'Зарегестрировать пользователя'})
    @ApiResponse({status: 200, type: LoginResponseDto})
    @Post('/register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return await this.usersService.register(registerUserDto);
    }

    @ApiOperation({'summary': 'Войти'})
    @ApiResponse({status: 200, type: LoginResponseDto})
    @Post('/login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.usersService.signIn(loginUserDto);
    }
}
