import * as process from "node:process";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";
import * as dotenv from 'dotenv';

async function start() {
    dotenv.config();
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('Task tracker')
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/swagger', app, swaggerDocument);

    await app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}
start()
