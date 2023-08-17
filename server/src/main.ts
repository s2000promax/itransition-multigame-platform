import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app/appConfig';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        allowedHeaders: [
            'content-type',
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Credentials',
            'Authorization',
            'Accept',
        ],
        origin: [appConfig().prod_origin, appConfig().dev_origin],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        credentials: true,
    });

    const port = appConfig().port;

    await app.listen(port);
}

bootstrap();
