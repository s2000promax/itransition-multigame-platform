import { Module } from '@nestjs/common';
import { GameGateway } from './webSocket/game.gateway';
import { GameSessionService } from './services/game-session.service';

@Module({
    providers: [GameGateway, GameSessionService],
})
export class GamePlatformModule {}
