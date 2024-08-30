import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from './constants';
import {AuthGuard} from "./auth.guard";
import {RolesGuard} from "./roles.guard";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '36000s'},
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {
}
