export class TaskDto {
    readonly title: string;
    readonly description: string;
    readonly type: string;
    readonly executor: number;
    readonly deadline: Date;
    readonly creationDate: Date;
    readonly status: string;
    readonly progress: number;

    constructor(
        title: string,
        description: string,
        type: string,
        executor: number,
        deadline: Date,
        creationDate: Date,
        status: string,
        progress: number,
    ) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.executor = executor;
        this.deadline = deadline;
        this.creationDate = creationDate;
        this.status = status;
        this.progress = progress;
    }
}