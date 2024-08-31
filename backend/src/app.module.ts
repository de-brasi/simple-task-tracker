import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import {User} from "./auth/user.entity";
import {Task} from "./tasks/task.entity";
import {TaskArchived} from "./tasks/task-archived.entity";
import * as process from "node:process";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            entities: [User, Task, TaskArchived],
            synchronize: true,
        }),
        TasksModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}