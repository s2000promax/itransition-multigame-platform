import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app/appConfig';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        allowedHeaders: ['content-type', 'Authorization', 'Accept'],
        origin: ['http://localhost:4200', 'http://95.111.247.254'],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        credentials: true,
    });

    const port = 3011;

    await app.listen(port);
}

bootstrap();
