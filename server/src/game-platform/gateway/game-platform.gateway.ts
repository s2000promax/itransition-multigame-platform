import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameTypesEnums } from '../../config/types/gameTypesEnums';
import { GameSessionService } from '../sessions/game-session.service';
import { GameSession } from '../sessions/model/game-session.model';
import { TicTacToeGame } from '../../games/tic-taс-toe/tic-taс-toe.game';

export interface MoveDto {
    sessionId: string;
    row: string;
    col: string;
}

export interface SessionPayload {
    gameId: string;
    gameType: GameTypesEnums;
}

@WebSocketGateway({
    namespace: '/game-platform',
    cors: {
        origin: '*',
        credentials: true,
    },
})
export class GamePlatformGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;

    constructor(private gameSessionService: GameSessionService) {}

    handleConnection(client: Socket) {
        console.log('#Connect', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('#Disconnect:', client.id);
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any) {
        console.log('#M:', client.id, payload);

        client.emit('message', 'Hello world!');
    }

    @SubscribeMessage('getGames')
    handleGetGames(client: Socket): void {
        const gamesListResponse = this.gameSessionService.getGames();
        client.emit('gameList', gamesListResponse);
    }

    @SubscribeMessage('createSession')
    createSession(client: Socket, gameType: GameTypesEnums): void {
        const sessionId = this.gameSessionService.createSession({
            gameType,
            ownerPlayerId: client.id,
        });
        client.emit('sessionCreated', sessionId);
    }

    @SubscribeMessage('joinSession')
    joinSession(client: Socket, sessionId: string): void {
        this.gameSessionService.joinSession(sessionId, client.id);
        client.emit('JoinedSession', 'success');
        console.log('#->', this.server);
    }

    @SubscribeMessage('makeMove')
    makeMove(client: Socket, { row, col, sessionId }: MoveDto): void {
        console.log(row, col, sessionId);
        const session = this.gameSessionService.findSession(sessionId);
        // console.log(this.server.sockets.sockets.get(session.ownerPlayerId[0]).emit());
        // Проверка, что игрок в сессии и его очередь ходить
        if (
            session.playersIds.includes(client.id) &&
            session.gameInstance instanceof TicTacToeGame
        ) {
            const result = session.gameInstance.makeMove(
                Number(row),
                Number(col),
            );

            if (result.status === 'winner') {
                // const winnerSocket = this.server.sockets.sockets.get(session.playersIds.find(id => id === result.winner));
                // const loserSocket = this.server.sockets.sockets.get(session.playersIds.find(id => id !== result.winner));
                const winnerSocket = this.server.sockets.sockets.get(
                    session.ownerPlayerId[0],
                );
                const loserSocket = this.server.sockets.sockets.get(
                    session.ownerPlayerId[1],
                );
                winnerSocket.emit('gameResult', { status: 'win' });
                loserSocket.emit('gameResult', { status: 'lose' });
            }
        }
    }

    /*
    @SubscribeMessage('createGame')
    handleCreateGame(client: Socket, payload: SessionPayload): void {
        const game = this.gameSessionService.createGame(payload.gameType);
        client.emit('gameCreated', game);
    }

    @SubscribeMessage('joinGame')
    handleJoinGame(client: Socket, payload: SessionPayload): void {
        const result = this.gameSessionService.joinGame(payload.gameId);
        client.emit('gameJoined', result);
    }

     */
}