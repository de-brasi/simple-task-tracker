import {ApiProperty} from "@nestjs/swagger";
import {TaskDto} from "../common/task.dto";

export class TasksListDto {
    @ApiProperty({ description: 'Чило задач', example: 3 })
    public readonly size: number;

    @ApiProperty({
        description: 'Задачи',
        example: [
            new TaskDto('Task 1', 'Description 1', 'Regular task', 1, new Date('2024-12-31'), new Date('2024-12-31'), 'started', 0),
            new TaskDto('Task 2', 'Description 2', 'Irregular task', 2, new Date('2024-12-31'), new Date('2024-12-31'), 'in-progress', 25),
            new TaskDto('Task 3', 'Description 3', 'Regular task', 1, new Date('2024-12-31'), new Date('2024-12-31'), 'done', 100),
        ]
    })
    public readonly tasks: TaskDto[];

    constructor(tasks: TaskDto[]) {
        this.tasks = tasks;
        this.size = tasks.length;
    }
}