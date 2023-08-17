import { Module } from '@nestjs/common';
import { GamePlatformGateway } from './gateway/game-platform.gateway';
import { GameSessionService } from './sessions/game-session.service';

@Module({
    imports: [],
    providers: [GamePlatformGateway, GameSessionService],
})
export class GamePlatformModule {}
