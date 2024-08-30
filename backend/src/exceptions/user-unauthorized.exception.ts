import {HttpException, HttpStatus} from "@nestjs/common";

export class UserUnauthorizedException extends HttpException {
    constructor() {
        super("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
}