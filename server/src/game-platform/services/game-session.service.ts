import { Injectable } from '@nestjs/common';
import { GameSession } from '../sessions/game-session.model';
import { CreateSessionDto } from '../dto/create-session.dto';
import { GameModel } from '../game/game-model';
import { ConnectionResult } from '../game/result/connection-result';
import { GameTypesEnums } from '../../config/types/gameTypesEnums';

@Injectable()
export class GameSessionService {
    private sessions: GameSession[] = [];

    createSession(createSessionDto: CreateSessionDto): GameSession {
        const session = new GameSession(
            createSessionDto.gameType,
            createSessionDto.playersIds,
        );
        this.sessions.push(session);
        return session;
    }

    joinSession(sessionId: string, playerId: string): GameSession | null {
        const session: GameSession = this.sessions.find(
            (s) => s.id === sessionId,
        );
        if (session) {
            session.playersIds.push(playerId);

            return session;
        }
        return null;
    }

    createGame(gameType: GameTypesEnums): GameModel {
        const game = new GameModel(gameType);
        // Code will be implemented here
        return game;
    }

    getGames(): GameModel[] {
        // Code will be implemented here
        return [];
    }

    joinGame(gameId: string): ConnectionResult {
        const success = true;
        const message = 'Success or Filed';
        return new ConnectionResult(success, message);
    }
}
