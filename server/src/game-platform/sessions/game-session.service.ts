import { Injectable } from '@nestjs/common';
import { GameTypesEnums } from '../../config/types/gameTypesEnums';
import { CreateSessionDto } from '../dto/create-session.dto';
import { TicTacToeGame } from '../../games/tic-taс-toe/tic-taс-toe.game';
import { SeaBattleGame } from '../../games/sea-batle/sea-batle.game';
import { PokerGame } from '../../games/poker/poker.game';
import { generateUniqueId } from '../../libs';
import { JoinSessionDto } from '../dto/join-session.dto';
import {
    GameSession,
    GamesListResponse,
    Player,
} from '../types/game-platform.type';

@Injectable()
export class GameSessionService {
    private sessions: Partial<GameSession>[] = [];
    private activeClients: string[] = [];

    get getActiveClients() {
        return this.activeClients;
    }
    addClient(clientId: string) {
        this.activeClients.push(clientId);
    }

    removeClient(clientId: string) {
        const indexToRemove = this.activeClients.findIndex(
            (id) => id === clientId,
        );
        if (indexToRemove !== -1) {
            this.activeClients.splice(indexToRemove, 1);
        }
    }

    getGames(): GamesListResponse {
        const availableGames = Object.values(GameTypesEnums);

        const waitingGames = this.sessions
            .filter((session) => session.players.length < 2)
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

    createSession(dto: CreateSessionDto) {
        const session: Partial<GameSession> = {
            id: generateUniqueId(),
            gameType: dto.gameType,
            ownerPlayerId: dto.ownerPlayer.id,
            players: [dto.ownerPlayer],
            status: 'waiting',
        };
        this.sessions.push(session);

        return session;
    }

    joinSession(dto: JoinSessionDto) {
        const session = this.findSessionById(dto.sessionId);

        session.players.push(dto.player);

        session.gameInstance = this.createGameInstance(
            session.gameType,
            session.players,
        );

        session.status = 'in-progress';

        return session;
    }

    deleteSession(clientId: string) {
        const indexToRemove = this.sessions.findIndex((session) => {
            const playerIndex = session.players.findIndex((player) =>
                player.id.includes(clientId),
            );
            return session.players[playerIndex];
        });

        if (indexToRemove !== -1) {
            const clientForNotification = this.sessions[indexToRemove].players
                .filter((player) => player.id !== clientId)
                .join();

            this.sessions.splice(indexToRemove, 1);

            return clientForNotification;
        }

        return '';
    }

    findSessionById(sessionId: string) {
        return this.sessions.find((s) => s.id === sessionId);
    }

    private createGameInstance(
        gameType: GameTypesEnums,
        players: Player[],
    ): TicTacToeGame | SeaBattleGame | PokerGame {
        switch (gameType.toString()) {
            case GameTypesEnums.TIC_TAC_TOE:
                return new TicTacToeGame(players);
            case GameTypesEnums.SEA_BATTLE:
                return new SeaBattleGame(players);
            case GameTypesEnums.POKER:
                return new PokerGame(players);
        }
    }
}
