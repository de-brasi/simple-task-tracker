import {IsIn, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {TaskStatus} from "../../tasks/task-status.enum";

export class UpdateTaskStatusDto {
    @IsString()
    @IsNotEmpty()
    @IsIn([TaskStatus.Started, TaskStatus.InProgress, TaskStatus.Finished])
    readonly status: string;

    @IsNumber()
    @IsNotEmpty()
    @IsIn([0, 25, 50, 75, 100])
    @ApiProperty({
        default: 0,
        enum: [0, 25, 50, 75, 100],
    })
    progress: number;
}