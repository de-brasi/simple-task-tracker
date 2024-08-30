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

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getAllTasksOwnedByAdmin(adminLogin: string): Promise<TasksListDto> {
        const admin = await this.userRepository.findOne({
            where: {login: adminLogin},
        });

        if (admin == null) {
            throw new UserNotExistsException(adminLogin);
        }

        const ownedTasks = await this.taskRepository.find({
            where: {owner: admin}
        });

        const taskDtos = ownedTasks.map(task => {
            return new TaskDto(
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
        const user = await this.userRepository.findOne({
            where: {login: userLogin},
        });

        if (user == null) {
            throw new UserNotExistsException(userLogin);
        }

        const assignedTasks = await this.taskRepository.find({
            where: {executor: user}
        });

        const taskDtos = assignedTasks.map(task => {
            return new TaskDto(
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
        const executor = await this.userRepository.findOne({
            where: { id: executorId },
        });
        const owner = await this.userRepository.findOne({
            where: { login: ownerLogin },
        });

        if (executor == null) {
            throw new UserIdNotExistsException(executorId);
        }
        if (owner == null) {
            throw new UserNotExistsException(ownerLogin);
        }

        entity.status = TaskStatus.Started;
        entity.executor = executor;
        entity.owner = owner;
        entity.progress = 0;

        await this.taskRepository.save(entity);
        return entity;
    }

    async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
        let entity = await this.taskRepository.findOne({
            where: { id: id },
        });

        if (entity == null) {
            throw new TaskNotExistsException(id);
        }

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
            const newExecutor = await this.userRepository.findOne({
                where: { id: updateTaskDto.executorId }
            });

            if (newExecutor == null) {
                throw new UserIdNotExistsException(updateTaskDto.executorId);
            }

            entity.executor = newExecutor;
        }
        await this.taskRepository.save(entity);
    }

    async deleteTask(id: number) {
        let entity = await this.taskRepository.findOne({
            where: { id: id },
        });

        if (entity == null) {
            throw new TaskNotExistsException(id);
        }

        await this.taskRepository.remove(entity);
    }

    async setTaskStatus(taskId: number, updateTaskStatusDto: UpdateTaskStatusDto) {
        let entity = await this.taskRepository.findOne({
            where: { id: taskId },
        });

        if (entity == null) {
            throw new TaskNotExistsException(taskId);
        }

        entity.status = updateTaskStatusDto.status;
        entity.progress = updateTaskStatusDto.progress;

        await this.taskRepository.save(entity);
    }

    async setTaskProgressAscendingOnly(taskId: number, updateTaskProgressDto: TaskProgressReportDto, login: string) {
        const executor = await this.userRepository.findOne({
            where: { login: login },
        });

        if (executor == null) {
            throw new UserNotExistsException(login);
        }

        let targetTask = await this.taskRepository.findOne({
            where: {id: taskId, executor: executor},
        });

        if (targetTask == null) {
            throw new TaskNotExistsException(taskId);
        }

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
}
