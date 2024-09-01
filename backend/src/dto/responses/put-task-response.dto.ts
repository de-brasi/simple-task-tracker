import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsOptional} from "class-validator";
import {TaskType} from "../../tasks/task-type.enum";
import {Type} from "class-transformer";
import {TaskStatus} from "../../tasks/task-status.enum";

export class PutTaskResponseDto {
    @ApiProperty({
        description: "id of changed/created task",
        default: 0
    })
    readonly id: number = null;

    @ApiProperty({
        description: "Task's title",
        default: "Very descriptive title"
    })
    readonly title: string = null;

    @ApiProperty({
        description: "Task's description",
        default: "Very descriptive description"
    })
    readonly description: string = null;

    @ApiProperty({
        description: "Task's type",
        default: TaskType.Task,
        enum: [TaskType.Task, TaskType.Epic, TaskType.Milestone]
    })
    readonly type: string = null;

    @ApiProperty({
        required: false,
        description: "New executor id",
        default: 0
    })
    readonly executorId: number = null;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    @ApiProperty({
        description: "Task's deadline",
        default: "01-01-2001"
    })
    readonly deadline: Date = null;

    @ApiProperty({
        description: "Task's status",
        default: TaskStatus.Started,
        enum: [TaskStatus.Started, TaskStatus.InProgress, TaskStatus.Finished],
    })
    readonly status: string = null;

    @ApiProperty({
        description: "Task's progress",
        default: 0,
        enum: [0, 25, 50, 75, 100],
    })
    progress: number = null;

    constructor(
        id: number,
        title: string,
        description: string,
        type: string,
        executorId: number,
        deadline: Date,
        status: string,
        progress: number
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.executorId = executorId;
        this.deadline = deadline;
        this.status = status;
        this.progress = progress;
    }
}