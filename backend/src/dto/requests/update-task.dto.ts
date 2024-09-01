import {IsDate, IsIn, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {TaskStatus} from "../../tasks/task-status.enum";
import {TaskType} from "../../tasks/task-type.enum";

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        nullable: true,
        description: "New title of task",
        default: "New title"
    })
    readonly title: string = null;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        nullable: true,
        description: "New description of task",
        default: "New description"
    })
    readonly description: string = null;

    @IsString()
    @IsOptional()
    @IsIn([TaskType.Task, TaskType.Epic, TaskType.Milestone])
    @ApiProperty({
        required: false,
        nullable: true,
        description: "New task's type",
        default: TaskType.Epic
    })
    readonly type: string = null;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: false,
        nullable: true,
        default: 0
    })
    readonly executorId: number = null;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    @ApiProperty({
        required: false,
        nullable: true,
        default: "01-01-2001"
    })
    readonly deadline: Date = null;

    @IsString()
    @IsOptional()
    @IsIn([TaskStatus.Started, TaskStatus.InProgress, TaskStatus.Finished])
    @ApiProperty({
        required: false,
        nullable: true,
        default: TaskStatus.Started,
        enum: [TaskStatus.Started, TaskStatus.InProgress, TaskStatus.Finished],
    })
    readonly status: string = null;

    @IsNumber()
    @IsOptional()
    @IsIn([0, 25, 50, 75, 100])
    @ApiProperty({
        required: false,
        nullable: true,
        default: 0,
        enum: [0, 25, 50, 75, 100],
    })
    progress: number = null;
}