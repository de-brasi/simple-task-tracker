import {HttpException, HttpStatus} from "@nestjs/common";

export class InvalidProgressValueException extends HttpException {
    constructor(toSetProgress: number, actualProgress: number) {
        super(`Invalid progress value. Got value: ${toSetProgress}. Actual value: ${actualProgress}. Only increasing progress available`, HttpStatus.BAD_REQUEST);
    }
}