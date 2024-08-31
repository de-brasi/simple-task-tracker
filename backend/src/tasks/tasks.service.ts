import {Injectable} from '@nestjs/common';
import {TaskDto} from "../dto/common/task.dto";
import {TasksListDto} from "../dto/responses/tasks-list.dto";
import {CreateTaskDto} from "../dto/requests/create-task.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./task.entity";
import {Repository} from "typeorm";
import {UpdateTaskDto} from "../dto/requests/update-task.dto";
import {UserNotExistsException} from "../exceptions/user-not-exists.exception";
import {TaskNotExistsException} from "../exceptions/task-not-exists.exception";
import {UpdateTaskStatusDto} from "../dto/requests/update-task-status.dto";
import {User} from "../auth/user.entity";
import {UserIdNotExistsException} from "../exceptions/user-id-not-exists.exception";
import {InvalidProgressValueException} from "../exceptions/invalid-progress-value.exception";
import {TaskProgressReportDto} from "../dto/requests/task-progress-report.dto";
import {TaskStatus} from "./task-status.enum";
import {FilterTasksDto} from "../dto/requests/filter-tasks.dto";
import {SortTasksDto} from "../dto/requests/sort-tasks.dto";
import {TaskArchived} from "./task-archived.entity";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,

        @InjectRepository(TaskArchived)
        private readonly taskArchivedRepository: Repository<TaskArchived>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getAllTasksOwnedByAdmin(adminLogin: string): Promise<TasksListDto> {
        const admin = await this.getOneUserByLoginOrThrow(adminLogin);
        const ownedTasks = await this.taskRepository.find({
            where: {owner: admin}
        });

        const taskDtos = ownedTasks.map(task => {
            return new TaskDto(
                task.id,
                task.title,
                task.description,
                task.type,
                task.executor.id,
                task.deadline,
                task.creationDate,
                task.status,
                task.progress,
            );
        });

        return new TasksListDto(taskDtos);
    }

    async getAllTasksAssignedToUser(userLogin: string): Promise<TasksListDto> {
        const user = await this.getOneUserByLoginOrThrow(userLogin);
        const assignedTasks = await this.taskRepository.find({
            where: {executor: user}
        });

        const taskDtos = assignedTasks.map(task => {
            return new TaskDto(
                task.id,
                task.title,
                task.description,
                task.type,
                task.executor.id,
                task.deadline,
                task.creationDate,
                task.status,
                task.progress,
            );
        });

        return new TasksListDto(taskDtos);
    }

    async createTask(createTaskDto: CreateTaskDto, ownerLogin: string) {
        const { executorId, ...taskData } = createTaskDto;

        let entity = await this.taskRepository.create(taskData);
        const executor = await this.getOneUserByIdOrThrow(executorId);
        const owner = await this.getOneUserByLoginOrThrow(ownerLogin);

        entity.status = TaskStatus.Started;
        entity.executor = executor;
        entity.owner = owner;
        entity.progress = 0;

        await this.taskRepository.save(entity);
        return entity;
    }

    async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
        let entity = await this.getOneTaskByConditionOrThrow({ id: id });

        if (updateTaskDto.title != undefined) {
            entity.title = updateTaskDto.title;
        }
        if (updateTaskDto.description != undefined) {
            entity.description = updateTaskDto.description;
        }
        if (updateTaskDto.type != undefined) {
            entity.type = updateTaskDto.type;
        }
        if (updateTaskDto.status != undefined) {
            entity.status = updateTaskDto.status;
        }
        if (updateTaskDto.progress != undefined) {
            entity.progress = updateTaskDto.progress;
        }
        if (updateTaskDto.deadline != undefined) {
            entity.deadline = updateTaskDto.deadline;
        }
        if (updateTaskDto.executorId != undefined) {
            entity.executor = await this.getOneUserByIdOrThrow(updateTaskDto.executorId);
        }
        await this.taskRepository.save(entity);
    }

    async deleteTask(id: number) {
        let task = await this.getOneTaskByConditionOrThrow({ id: id });

        // archive
        const archivedTask = new TaskArchived();
        archivedTask.owner = task.owner;
        archivedTask.title = task.title;
        archivedTask.description = task.description;
        archivedTask.type = task.type;
        archivedTask.executor = task.executor;
        archivedTask.deadline = task.deadline;
        archivedTask.creationDate = task.creationDate;
        archivedTask.status = task.status;
        archivedTask.progress = task.progress;

        await this.taskArchivedRepository.save(archivedTask);
        await this.taskRepository.remove(task);
    }

    async setTaskStatus(taskId: number, updateTaskStatusDto: UpdateTaskStatusDto) {
        let entity = await this.getOneTaskByConditionOrThrow({ id: taskId });

        entity.status = updateTaskStatusDto.status;
        entity.progress = updateTaskStatusDto.progress;

        await this.taskRepository.save(entity);
    }

    async setTaskProgressAscendingOnly(taskId: number, updateTaskProgressDto: TaskProgressReportDto, login: string) {
        const executor = await this.getOneUserByLoginOrThrow(login);
        const targetTask = await this.getOneTaskByConditionOrThrow({id: taskId, executor: executor});

        // only increasing progress available
        if (targetTask.progress >= updateTaskProgressDto.progress) {
            throw new InvalidProgressValueException(updateTaskProgressDto.progress, targetTask.progress);
        }

        if (0 < updateTaskProgressDto.progress && updateTaskProgressDto.progress < 100) {
            targetTask.status = TaskStatus.InProgress;
        } else if (updateTaskProgressDto.progress == 100) {
            targetTask.status = TaskStatus.Finished;
        }

        targetTask.progress = updateTaskProgressDto.progress;
        await this.taskRepository.save(targetTask);
    }

    async getFilteredTasks(adminLogin: string, filterTasksDto: FilterTasksDto): Promise<TasksListDto> {
        const admin = await this.getOneUserByLoginOrThrow(adminLogin);
        const filterCondition: Record<string, any> = {owner: admin};

        if (filterTasksDto.type != undefined) {
            filterCondition.type = filterTasksDto.type;
        }
        if (filterTasksDto.status != undefined) {
            filterCondition.status = filterTasksDto.status;
        }
        if (filterTasksDto.deadline != undefined) {
            filterCondition.deadline = filterTasksDto.deadline;
        }
        if (filterTasksDto.creationDate != undefined) {
            filterCondition.creationDate = filterTasksDto.creationDate;
        }
        if (filterTasksDto.executorId != undefined) {
            console.log("executor is:", filterTasksDto.executorId);
            filterCondition.executor = await this.getOneUserByIdOrThrow(filterTasksDto.executorId);
        }

        console.log(filterCondition);

        const filteredOwnedTasks = await this.taskRepository.find({
            where: filterCondition
        });

        const taskDtos = filteredOwnedTasks.map(task => {
            return new TaskDto(
                task.id,
                task.title,
                task.description,
                task.type,
                task.executor.id,
                task.deadline,
                task.creationDate,
                task.status,
                task.progress,
            );
        });

        return new TasksListDto(taskDtos);
    }

    async getSortedTasks(adminLogin: string, sortTaskDto: SortTasksDto): Promise<TasksListDto> {
        const admin = await this.getOneUserByLoginOrThrow(adminLogin);
        console.log(sortTaskDto);

        const {field, order} = sortTaskDto;

        console.log(field, order);

        const filteredOwnedTasks = await this.taskRepository.find({
            where: {owner: admin},
            order: {[field]: order}
        });

        const taskDtos = filteredOwnedTasks.map(task => {
            return new TaskDto(
                task.id,
                task.title,
                task.description,
                task.type,
                task.executor.id,
                task.deadline,
                task.creationDate,
                task.status,
                task.progress,
            );
        });

        return new TasksListDto(taskDtos);
    }

    private async getOneUserByIdOrThrow(id: number): Promise<User> {
        const searched = await this.userRepository.findOne({
            where: { id: id },
        });

        if (searched == null) {
            throw new UserIdNotExistsException(id);
        }

        return searched;
    }

    private async getOneUserByLoginOrThrow(login: string): Promise<User> {
        const searched = await this.userRepository.findOne({
            where: { login: login },
        });

        if (searched == null) {
            throw new UserNotExistsException(login);
        }

        return searched;
    }

    private async getOneTaskByConditionOrThrow(condition: Record<string, any>): Promise<Task> {
        let searched = await this.taskRepository.findOne({
            where: condition,
        });

        if (searched == null) {
            throw new TaskNotExistsException(condition.id);
        }

        return searched;
    }
}
