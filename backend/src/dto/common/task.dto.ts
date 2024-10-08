export class TaskDto {
    readonly id: number;
    readonly title: string;
    readonly description: string;
    readonly type: string;
    readonly executorId: number;
    readonly deadline: Date;
    readonly creationDate: Date;
    readonly status: string;
    readonly progress: number;

    constructor(
        id: number,
        title: string,
        description: string,
        type: string,
        executorId: number,
        deadline: Date,
        creationDate: Date,
        status: string,
        progress: number,
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.executorId = executorId;
        this.deadline = deadline;
        this.creationDate = creationDate;
        this.status = status;
        this.progress = progress;
    }
}