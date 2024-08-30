import {IsIn, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {SortAttribute} from "./sort-attribute.enum";

export class SortTasksDto {
    @IsString()
    @IsNotEmpty()
    @IsIn([
        SortAttribute.Title, SortAttribute.Status,
        SortAttribute.Type, SortAttribute.Progress,
        SortAttribute.CreationDate, SortAttribute.Deadline
    ])
    @ApiProperty({
        default: SortAttribute.Progress,
        enum: [
            SortAttribute.Title, SortAttribute.Status,
            SortAttribute.Type, SortAttribute.Progress,
            SortAttribute.CreationDate, SortAttribute.Deadline
        ],
    })
    readonly field: string = null;

    @IsString()
    @IsNotEmpty()
    @IsIn(['ASC', 'DESC'])
    @ApiProperty({
        default: 'ASC',
        enum: ['ASC', 'DESC'],
    })
    readonly order: string = null;
}