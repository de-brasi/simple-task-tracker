// test-database.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenericContainer } from 'testcontainers';
import { DataSource } from 'typeorm';
import {PostgreSqlContainer} from "@testcontainers/postgresql";

@Module({})
export class TestDatabaseModule {
    static async forRoot(entities: any[]): Promise<DynamicModule> {
        const container = await new PostgreSqlContainer('postgres')
            .withExposedPorts(5432)
            .withUsername("postgres")
            .withPassword("postgres")
            .withDatabase("task-tracker")
            .start();

        const dataSource = new DataSource({
            type: "postgres",
            host: container.getHost(),
            port: container.getMappedPort(5432),
            username: "postgres",
            password: "postgres",
            database: "task-tracker",
            entities: entities,
            synchronize: true,
        });

        await dataSource.initialize();

        return {
            module: TestDatabaseModule,
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: container.getHost(),
                    port: container.getMappedPort(5432),
                    username: 'postgres',
                    password: 'postgres',
                    database: 'task-tracker',
                    entities: entities,
                    synchronize: true,
                }),
                TypeOrmModule.forFeature(entities),
            ],
            providers: [
                {
                    provide: 'DATA_SOURCE',
                    useValue: dataSource,
                },
            ],
            exports: ['DATA_SOURCE'],
        };
    }
}
