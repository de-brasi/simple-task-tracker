import {HttpException, HttpStatus} from "@nestjs/common";

export class LoginTakenException extends HttpException {
    constructor() {
        super("Login already used", HttpStatus.BAD_REQUEST);
    }
}