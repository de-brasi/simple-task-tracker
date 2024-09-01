import {IsDate, IsIn, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {TaskType} from "../../tasks/task-type.enum";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Descriptive title",
        default: "Task №..."
    })
    public readonly title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Descriptive description",
        default: "Hmmm..."
    })
    public readonly description: string;

    @IsString()
    @IsNotEmpty()
    @IsIn([TaskType.Task, TaskType.Epic, TaskType.Milestone])
    @ApiProperty({
        default: TaskType.Task
    })
    public readonly type: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        description: "Id of user-executor",
        default: 0
    })
    public readonly executorId: number;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    @ApiProperty({
        description: "Date of deadline",
        default: "01-01-2001"
    })
    public readonly deadline: Date;
}