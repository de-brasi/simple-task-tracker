// app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestDatabaseModule } from './test-database.module';
import {TaskArchived} from "../src/tasks/task-archived.entity";
import {Task} from "../src/tasks/task.entity";
import {User} from "../src/auth/user.entity";
import {Repository} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let userRepository: Repository<User>;
    let taskRepository: Repository<Task>;
    let taskArchivedRepository: Repository<TaskArchived>;
    let adminJwtToken: string;
    let executorJwtToken: string;
    let executorId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                await TestDatabaseModule.forRoot([User, TaskArchived, Task]),
                AppModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Получение ссылки на репозиторий User
        userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

        // Регистрация пользователя-администратора
        const adminUser = {
            login: 'admin@login',
            role: 'admin',
            password: 'admin-password',
        };

        const adminRegisterResponse = await request(app.getHttpServer())
            .post('/auth/register')
            .send(adminUser);

        expect(adminRegisterResponse.status).toBe(HttpStatus.CREATED);
        adminJwtToken = adminRegisterResponse.body.accessToken;

        // Регистарция исполнителя
        const executorUser = {
            login: 'executor@login',
            role: 'executor',
            password: 'executor-password',
        };

        const executorRegisterResponse = await request(app.getHttpServer())
            .post('/auth/register')
            .send(executorUser);
        expect(executorRegisterResponse.status).toBe(HttpStatus.CREATED);
        adminJwtToken = executorRegisterResponse.body.accessToken;
    }, 30000);

    it('Создание задачи (POST /api/tasks)', async () => {
        const createTaskDto = {
            title: 'New Task',
            description: 'Important task description',
            type: 'Task',
            executorId: 2,
            deadline: new Date(),
        };

        const response = await request(app.getHttpServer())
            .post('/api/tasks')
            .set('Authorization', `Bearer ${adminJwtToken}`)
            .send(createTaskDto);

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(createTaskDto.title);
    });

    afterAll(async () => {
        await taskRepository.query(`DELETE FROM task`); // Очистка таблицы задач
        await taskArchivedRepository.query(`DELETE FROM task_archived`); // Очистка таблицы архивированных задач
        await userRepository.query(`DELETE FROM users`); // Очистка таблицы пользователей
        await app.close();
    });
});
