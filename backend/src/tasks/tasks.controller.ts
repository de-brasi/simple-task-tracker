import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Request,
    UseGuards
} from '@nestjs/common';
import {TasksService} from "./tasks.service";
import {CreateTaskDto} from "../dto/requests/create-task.dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TasksListDto} from "../dto/responses/tasks-list.dto";
import {UpdateTaskDto} from "../dto/requests/update-task.dto";
import {UpdateTaskStatusDto} from "../dto/requests/update-task-status.dto";
import {AuthGuard} from "../auth/auth.guard";
import {Roles} from "../auth/roles.decorator";
import {Role} from "../auth/role.enum";
import {RolesGuard} from "../auth/roles.guard";
import {TaskProgressReportDto} from "../dto/requests/task-progress-report.dto";

@Controller('api/tasks')
@ApiTags('Задачи')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @UseGuards(AuthGuard)
    @Get()
    @ApiOperation({'summary': 'Получить все назначенные задачи (если запрашивающий - исполнитель) или все задачи (если админ)'})
    @ApiResponse({status: 200, type: TasksListDto})
    async getAllTasks(@Request() req) {
        const requestedUserLogin = req.user.username;

        if (req.user.role == Role.User) {
            return await this.tasksService.getAllTasksAssignedToUser(requestedUserLogin);
        } else if (req.user.role == Role.Admin) {
            return await this.tasksService.getAllTasksOwnedByAdmin(requestedUserLogin);
        }

        throw new HttpException(`Not expected role ${req.user.role}`, HttpStatus.NOT_FOUND);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Post()
    @Roles(Role.Admin)
    @ApiOperation({'summary': 'Только для роли admin. Создать новую задачу'})
    async createNewTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
        const ownerLogin = req.user.username;
        await this.tasksService.createTask(createTaskDto, ownerLogin);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Put('/:id')
    @Roles(Role.Admin)
    @ApiOperation({'summary': 'Только для роли admin. Изменить задачу'})
    async updateTask(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
        await this.tasksService.updateTask(id, updateTaskDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Delete('/:id')
    @Roles(Role.Admin)
    @ApiOperation({'summary': 'Только для роли admin. Удалить задачу'})
    async deleteTask(@Param('id') id: number) {
        await this.tasksService.deleteTask(id);
    }

    @UseGuards(AuthGuard)
    @Put('/:id/status')
    @Roles(Role.Admin)
    @ApiOperation({'summary': 'Только для роли admin. Установить статус и прогресс выполнения задачи'})
    async setTaskStatus(@Param('id') id: number, @Body() updateTaskStatusDto: UpdateTaskStatusDto, @Request() req) {
        await this.tasksService.setTaskStatus(id, updateTaskStatusDto);
    }

    @UseGuards(AuthGuard)
    @Put('/:id/progress-report')
    @Roles(Role.User)
    @ApiOperation({'summary': 'Только для роли user. Установить прогресс выполнения задачи. Новое значение прогресса должно быть строго больше предыдущего.'})
    async reportTaskProgress(@Param('id') id: number, @Body() updateTaskProgressDto: TaskProgressReportDto, @Request() req) {
        const executorLogin = req.user.username;
        await this.tasksService.setTaskProgressAscendingOnly(id, updateTaskProgressDto, executorLogin);
    }

    @UseGuards(AuthGuard)
    @Get('/filtered')
    @ApiOperation({'summary': 'Получить задачи по условию'})
    async getFilteredTasks(@Request() req) {
        // todo: разделять что позволено пользователю, а что - админу
        // todo:
        // if (req.user.role == Role.User) {
        //     // todo: это работает
        //     throw new TaskNotExistsException(1);
        // } else if (req.user.role == Role.Admin) {
        //     // todo: это работает
        //     throw new TaskNotExistsException(2);
        // }

        // TODO
        const requestedUserLogin = req.user.username;

        if (req.user.role == Role.User) {
            return await this.tasksService.getAllTasksAssignedToUser(requestedUserLogin);
        } else if (req.user.role == Role.Admin) {
            return await this.tasksService.getAllTasksOwnedByAdmin(requestedUserLogin);
        }

        throw new HttpException(`Not expected role ${req.user.role}`, HttpStatus.NOT_FOUND);
    }

    @UseGuards(AuthGuard)
    @Get('/filtered')
    @ApiOperation({'summary': 'Получить задачи в отсортированном виде'})
    @Get('/sorted')
    async getSortedTasks(@Request() req) {
        // todo: разделять что позволено пользователю, а что - админу
        // todo:
        // if (req.user.role == Role.User) {
        //     // todo: это работает
        //     throw new TaskNotExistsException(1);
        // } else if (req.user.role == Role.Admin) {
        //     // todo: это работает
        //     throw new TaskNotExistsException(2);
        // }

        // TODO
        const requestedUserLogin = req.user.username;

        if (req.user.role == Role.User) {
            return await this.tasksService.getAllTasksAssignedToUser(requestedUserLogin);
        } else if (req.user.role == Role.Admin) {
            return await this.tasksService.getAllTasksOwnedByAdmin(requestedUserLogin);
        }

        throw new HttpException(`Not expected role ${req.user.role}`, HttpStatus.NOT_FOUND);
    }
}
