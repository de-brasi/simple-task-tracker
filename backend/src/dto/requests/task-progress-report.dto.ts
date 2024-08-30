import {IsIn, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class TaskProgressReportDto {
    @IsNumber()
    @IsNotEmpty()
    @IsIn([0, 25, 50, 75, 100])
    @ApiProperty({
        description: "New value of task's progress. Must be greater than actual",
        default: 0,
        enum: [0, 25, 50, 75, 100],
    })
    progress: number;
}