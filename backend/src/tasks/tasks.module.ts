import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "./task.entity";
import {TasksController} from "./tasks.controller";
import {TasksService} from "./tasks.service";
import {AuthModule} from "../auth/auth.module";
import {User} from "../auth/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Task]),
        TypeOrmModule.forFeature([User]),
        AuthModule,
    ],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
