// app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {TaskArchived} from "../src/tasks/task-archived.entity";
import {Task} from "../src/tasks/task.entity";
import {User} from "../src/auth/user.entity";
import {DataSource, Repository} from "typeorm";
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {PostgreSqlContainer, StartedPostgreSqlContainer} from "@testcontainers/postgresql";
import process from "node:process";
import {PullPolicy} from "testcontainers";
import * as dotenv from 'dotenv';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let pgContainer: StartedPostgreSqlContainer;
    let adminJwtToken: string;
    let executorJwtToken: string;
    let executorId: number;

    beforeAll(async () => {
        dotenv.config({ path: '../../.env' });

        // pgContainer = await new PostgreSqlContainer('postgres:13-alpine')
        //     .withPullPolicy(PullPolicy.alwaysPull())
        //     .withExposedPorts(5432)
        //     .withDatabase('test-task-tracker')
        //     .withUsername("postgres")
        //     .withPassword("postgres")
        //     .start();


        pgContainer = await new PostgreSqlContainer('postgres:13-alpine')
            .withPullPolicy(PullPolicy.alwaysPull())
            .withExposedPorts(5432)
            .withDatabase(process.env.POSTGRES_DATABASE)
            .withUsername(process.env.POSTGRES_USERNAME)
            .withPassword(process.env.POSTGRES_PASSWOR)
            .start();

        console.log("Container host:", pgContainer.getHost());
        console.log("Container port:", pgContainer.getPort());
        console.log("Container URI:", pgContainer.getConnectionUri());

        console.log("Process:", process);

        process.env.POSTGRES_HOST = pgContainer.getHost();
        process.env.POSTGRES_PORT = pgContainer.getPort().toString();
        process.env.POSTGRES_USERNAME = pgContainer.getUsername();
        process.env.POSTGRES_PASSWORD = pgContainer.getPassword();
        process.env.POSTGRES_DATABASE = pgContainer.getDatabase();

        // Проверка установленных переменных
        console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);
        console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT);

        console.log("Container host:", pgContainer.getHost());
        console.log("Container ip:", pgContainer.getConnectionUri());

        // const moduleFixture: TestingModule = await Test.createTestingModule({
        //     imports: [AppModule,],
        // })
        //     .overrideProvider('TypeOrmModuleOptions')
        //     .useValue({
        //         type: 'postgres',
        //         host: pgContainer.getHost(),
        //         port: pgContainer.getPort(),
        //         username: pgContainer.getUsername(),
        //         password: pgContainer.getPassword(),
        //         database: pgContainer.getDatabase(),
        //         entities: [Task, TaskArchived, User],
        //         synchronize: true,
        //     })
        //     .compile();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // // Получение ссылки на репозиторий User
        // userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
        //
        // // Регистрация пользователя-администратора
        // const adminUser = {
        //     login: 'admin@login',
        //     role: 'admin',
        //     password: 'admin-password',
        // };
        //
        // const adminRegisterResponse = await request(app.getHttpServer())
        //     .post('/auth/register')
        //     .send(adminUser);
        //
        // expect(adminRegisterResponse.status).toBe(HttpStatus.CREATED);
        // adminJwtToken = adminRegisterResponse.body.accessToken;
        //
        // // Регистарция исполнителя
        // const executorUser = {
        //     login: 'executor@login',
        //     role: 'executor',
        //     password: 'executor-password',
        // };
        //
        // const executorRegisterResponse = await request(app.getHttpServer())
        //     .post('/auth/register')
        //     .send(executorUser);
        // expect(executorRegisterResponse.status).toBe(HttpStatus.CREATED);
        // adminJwtToken = executorRegisterResponse.body.accessToken;
    }, 120_000);

    afterAll(async () => {
        await pgContainer.stop();
        await app.close();
    });

    // it('Создание задачи (POST /api/tasks)', async () => {
    //     const createTaskDto = {
    //         title: 'New Task',
    //         description: 'Important task description',
    //         type: 'Task',
    //         executorId: 2,
    //         deadline: new Date(),
    //     };
    //
    //     const response = await request(app.getHttpServer())
    //         .post('/api/tasks')
    //         .set('Authorization', `Bearer ${adminJwtToken}`)
    //         .send(createTaskDto);
    //
    //     expect(response.status).toBe(HttpStatus.CREATED);
    //     expect(response.body).toHaveProperty('id');
    //     expect(response.body.title).toBe(createTaskDto.title);
    // });

    describe('Process environment check', () => {
        it('should check if process is available', () => {
            console.log('Process:', process);
            expect(process).toBeDefined();
            expect(process.env).toBeDefined();
        });
    });

    it('/api/tasks (GET) should return 403 when not authenticated', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/tasks')
            .expect(403);

        expect(response.body).toEqual({
            statusCode: 403,
            message: 'Forbidden resource',
            error: 'Forbidden',
        });
    });

});
