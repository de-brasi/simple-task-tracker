import {HttpException, HttpStatus} from "@nestjs/common";

export class UserNotExistsException extends HttpException {
    constructor(login: string) {
        super(`User with login ${login} not exists`, HttpStatus.BAD_REQUEST);
    }
}