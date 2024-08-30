import {IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

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
    @ApiProperty({
        default: "type of some important task description"
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