import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/app/appConfig';

import { GamePlatformModule } from './game-platform/game-platform.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
        GamePlatformModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
