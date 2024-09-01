import {IsIn, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {TaskStatus} from "../../tasks/task-status.enum";

export class UpdateTaskStatusDto {
    @IsString()
    @IsNotEmpty()
    @IsIn([TaskStatus.Started, TaskStatus.InProgress, TaskStatus.Finished])
    @ApiProperty({
        default: TaskStatus.Started,
        description: 'Task\'s status: ' + [TaskStatus.Started, TaskStatus.InProgress, TaskStatus.Finished],
        enum: [TaskStatus.Started, TaskStatus.InProgress, TaskStatus.Finished]
    })
    readonly status: string;

    @IsNumber()
    @IsNotEmpty()
    @IsIn([0, 25, 50, 75, 100])
    @ApiProperty({
        default: 0,
        description: "Progress of task (0, 25, 50, 75, 100)%",
        enum: [0, 25, 50, 75, 100],
    })
    progress: number;
}