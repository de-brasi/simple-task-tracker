import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {QueryFailedError, Repository} from "typeorm";
import {User} from "./user.entity";
import {RegisterUserDto} from "../dto/requests/register-user.dto";
import {LoginTakenException} from "../exceptions/login-taken.exception";
import {LoginUserDto} from "../dto/requests/login-user.dto";
import {LoginResponseDto} from "../dto/responses/login-response.dto";
import {UserNotExistsException} from "../exceptions/user-not-exists.exception";
import {JwtService} from "@nestjs/jwt";
import {InvalidCredentials} from "../exceptions/invalid-credentials.exception";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @Inject()
        private readonly jwtService: JwtService
    ) {
    }

    async register(userDto: RegisterUserDto): Promise<LoginResponseDto> {
        const entity = this.usersRepository.create(userDto);

        try {
            await this.usersRepository.save(entity);
            const payload = {sub: entity.id, username: entity.login, role: entity.role};
            return new LoginResponseDto(
                await this.jwtService.signAsync(payload)
            );
        } catch (error) {
            if (error instanceof QueryFailedError && (error as any).code === '23505') {
                throw new LoginTakenException();
            } else {
                throw error;
            }
        }
    }

    async signIn(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
        const entity = await this.usersRepository.findOne({
            where: {login: loginUserDto.login, password: loginUserDto.password},
        });

        if (entity == null) {
            throw new InvalidCredentials();
        }

        const payload = {sub: entity.id, username: entity.login, role: entity.role};
        return new LoginResponseDto(
            await this.jwtService.signAsync(payload)
        );
    }
}
