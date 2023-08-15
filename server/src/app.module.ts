import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/app/appConfig';
import { PrismaModule } from './prisma/prisma.module';
import { GamePlatformModule } from './game-platform/game-platform.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
        PrismaModule,
        GamePlatformModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
