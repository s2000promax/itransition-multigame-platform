import { Injectable } from '@nestjs/common';
import { GameTypesEnums } from '../../config/types/gameTypesEnums';
import { CreateSessionDto } from '../dto/create-session.dto';
import { TicTacToeGame } from '../../games/tic-taс-toe/tic-taс-toe.game';
import { SeaBattleGame } from '../../games/sea-batle/sea-batle.game';
import { PokerGame } from '../../games/poker/poker.game';
import { generateUniqueId } from '../../libs';

export interface GameModelResponse {
    sessionId: string;
    ownerPlayerId: string;
    gameName: GameTypesEnums;
}

export interface GamesListResponse {
    availableGames: GameTypesEnums[];
    waitingGames: GameModelResponse[];
}

export interface GameSession {
    id: string;
    gameType: GameTypesEnums;
    playersIds: string[];
    ownerPlayerId: string;
    gameInstance: TicTacToeGame | SeaBattleGame | PokerGame;
    status: 'waiting' | 'in-progress' | 'finished';
}

@Injectable()
export class GameSessionService {
    private sessions: Partial<GameSession>[] = [];

    getGames(): GamesListResponse {
        const availableGames = Object.values(GameTypesEnums);

        const waitingGames = this.sessions
            .filter((session) => session.playersIds.length < 2)
            .map((session) => ({
                sessionId: session.id,
                ownerPlayerId: session.ownerPlayerId,
                gameName: session.gameType,
            }));

        return {
            availableGames,
            waitingGames,
        };
    }

    createSession(createSessionDto: CreateSessionDto) {
        const session: Partial<GameSession> = {
            id: generateUniqueId(),
            gameType: createSessionDto.gameType,
            ownerPlayerId: createSessionDto.ownerPlayerId,
            playersIds: [createSessionDto.ownerPlayerId],
            status: 'waiting',
        };
        this.sessions.push(session);

        return session.id;
    }

    joinSession(sessionId: string, playerId: string) {
        const session = this.findSession(sessionId);

        session.playersIds.push(playerId);

        session.gameInstance = this.createGameInstance(
            session.gameType,
            session.playersIds,
        );

        session.status = 'in-progress';
        console.log('#Join', session);
    }

    findSession(sessionId: string) {
        return this.sessions.find((s) => s.id === sessionId);
    }

    private createGameInstance(
        gameType: GameTypesEnums,
        playersIds: string[],
    ): TicTacToeGame | SeaBattleGame | PokerGame {
        switch (gameType.toString()) {
            case GameTypesEnums.TIC_TAC_TOE:
                return new TicTacToeGame(playersIds);
            case GameTypesEnums.SEA_BATTLE:
                return new SeaBattleGame(playersIds);
            case GameTypesEnums.POKER:
                return new PokerGame(playersIds);
        }
    }
}
