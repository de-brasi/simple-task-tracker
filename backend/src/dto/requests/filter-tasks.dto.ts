import {IsDate, IsIn, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {TaskStatus} from "../../tasks/task-status.enum";
import {Type} from "class-transformer";

export class FilterTasksDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        nullable: true,
        default: "Some type"
    })
    readonly type: string = null;

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
    @ApiProperty({
        required: false,
        nullable: true,
        default: "1"
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
    readonly creationDate: Date = null;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    @ApiProperty({
        required: false,
        nullable: true,
        default: "01-01-2001"
    })
    readonly deadline: Date = null;
}