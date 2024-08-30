import {IsDate, IsIn, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {TaskStatus} from "../../tasks/task-status.enum";
import {TaskType} from "../../tasks/task-type.enum";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "new task"
    })
    public readonly title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "some important task description"
    })
    public readonly description: string;

    @IsString()
    @IsNotEmpty()
    @IsIn([TaskType.Epic, TaskType.Milestone])
    @ApiProperty({
        default: TaskType.Epic
    })
    public readonly type: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        default: "id of user-executor"
    })
    public readonly executorId: number;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    @ApiProperty({
        default: "date of deadline"
    })
    public readonly deadline: Date;
}