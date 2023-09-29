import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameSessionService } from '../sessions/game-session.service';
import { TicTacToeGame } from '../../games/tic-taс-toe/tic-taс-toe.game';
import { MoveDto } from '../dto/move.dto';
import {
    CreateSessionRequest,
    JoinSessionRequest,
} from '../types/game-platform.type';
import { SeaBattleGame } from '../../games/sea-batle/sea-batle.game';
import { PokerGame } from '../../games/poker/poker.game';
import appConfig from '../../config/app/appConfig';

@WebSocketGateway({
    namespace: 'game-platform',
    cors: {
        origin: 'https://itransition-7.netlify.app',
        credentials: false,
        methods: ['GET', 'OPTIONS'],
        allowedHeaders: ['Access-Control-Allow-Origin'],
    },
})
export class GamePlatformGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;

    constructor(private gameSessionService: GameSessionService) {}

    async handleConnection(client: Socket) {
        this.gameSessionService.addClient(client.id);

        const gamesListResponse = this.gameSessionService.getGames();
        client.emit('gameList', gamesListResponse);
    }

    async handleDisconnect(client: Socket) {
        const connection = this.gameSessionService.deleteSession(client.id);
        if (connection) {
            this.server
                .to(connection)
                .emit('message', 'Your opponent has left the game');
        }

        this.gameSessionService.removeClient(client.id);
        client.disconnect();

        this.updateGameList();
    }

    @SubscribeMessage('createSession')
    async createSession(client: Socket, data: CreateSessionRequest) {
        const session = this.gameSessionService.createSession({
            gameType: data.gameType,
            ownerPlayer: {
                id: client.id,
                username: data.userName,
            },
        });

        client.emit('sessionCreated', [client.id, session.id]);

        this.updateGameList();
    }

    @SubscribeMessage('joinSession')
    async joinSession(client: Socket, data: JoinSessionRequest) {
        const session = this.gameSessionService.joinSession({
            sessionId: data.sessionId,
            player: {
                id: client.id,
                username: data.userName,
            },
        });

        client.emit('sessionJoined', [client.id, session.id]);

        this.updateGameList();

        const connections = this.gameSessionService
            .findSessionById(data.sessionId)
            .players.map((player) => player.id);

        for (const connection of connections) {
            this.server
                .to(connection)
                .emit('sessionUpdated', [session, connection]);
        }
    }

    @SubscribeMessage('makeMove')
    async makeMove(client: Socket, dto: MoveDto) {
        const session = this.gameSessionService.findSessionById(dto.sessionId);
        if (session.gameInstance instanceof TicTacToeGame) {
            const gameState = session.gameInstance.makeMove(dto.row, dto.col);
            const connections = session.players.map((player) => player.id);

            if (gameState.status === 'win') {
                const winnerSocket = this.server.to(connections[0]);
                const loserSocket = this.server.to(connections[1]);

                winnerSocket.emit('gameState', gameState);
                loserSocket.emit('gameState', { ...gameState, status: 'lose' });
            } else {
                for (const connection of connections) {
                    this.server.to(connection).emit('gameState', gameState);
                }
            }
        }

        if (session.gameInstance instanceof SeaBattleGame) {
            const gameState = session.gameInstance.makeMove(dto.row, dto.col);
            const connections = session.players.map((player) => player.id);

            if (gameState.status === 'win') {
                const winnerSocket = this.server.to(gameState.currentPlayer.id);
                const loserSocket = this.server.to(
                    gameState.players.find(
                        (player) => player.id !== gameState.currentPlayer.id,
                    ).id,
                );

                winnerSocket.emit('gameState', gameState);
                loserSocket.emit('gameState', { ...gameState, status: 'lose' });
            } else {
                for (const connection of connections) {
                    const gameStateResponse = {
                        ...gameState,
                        players: gameState.players.filter(
                            (player) => player.id == connection,
                        ),
                    };

                    this.server
                        .to(connection)
                        .emit('gameState', gameStateResponse);
                }
            }
        }

        if (session.gameInstance instanceof PokerGame) {
        }
    }

    @SubscribeMessage('getState')
    async getState(client: Socket, sessionId: string) {
        const session = this.gameSessionService.findSessionById(sessionId);
        const connections = session.players.map((player) => player.id);

        if (session.gameInstance instanceof TicTacToeGame) {
            const gameState = session.gameInstance.startGame();

            for (const connection of connections) {
                this.server.to(connection).emit('gameState', gameState);
            }
        }

        if (session.gameInstance instanceof SeaBattleGame) {
            const gameState = session.gameInstance.startGame();

            for (const connection of connections) {
                const gameStateResponse = {
                    ...gameState,
                    players: gameState.players.filter(
                        (player) => player.id == connection,
                    ),
                };

                this.server.to(connection).emit('gameState', gameStateResponse);
            }
        }

        if (session.gameInstance instanceof PokerGame) {
        }
    }

    private updateGameList() {
        const gamesListResponse = this.gameSessionService.getGames();
        const connections = this.gameSessionService.getActiveClients;

        for (const connection of connections) {
            this.server.to(connection).emit('gameList', gamesListResponse);
        }
    }
}
