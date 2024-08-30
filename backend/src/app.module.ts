import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import {User} from "./auth/user.entity";
import {Task} from "./tasks/task.entity";
import {TaskArchived} from "./tasks/task-archived.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'postgres',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'task-tracker',
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