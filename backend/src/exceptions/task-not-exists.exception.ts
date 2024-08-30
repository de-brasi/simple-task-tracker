import {HttpException, HttpStatus} from "@nestjs/common";

export class TaskNotExistsException extends HttpException {
    constructor(id: number) {
        super(`Task with ${id} not exists or access denied`, HttpStatus.BAD_REQUEST);
    }
}