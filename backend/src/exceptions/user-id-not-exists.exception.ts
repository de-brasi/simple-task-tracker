import {HttpException, HttpStatus} from "@nestjs/common";

export class UserIdNotExistsException extends HttpException {
    constructor(id: number) {
        super(`User with id ${id} not exists`, HttpStatus.BAD_REQUEST);
    }
}