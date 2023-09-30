import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app/appConfig';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const port = process.env.VERCEL_PORT || 3011;
    console.log(port);
    await app.listen(port);
}

bootstrap();
