import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameSessionService } from '../services/game-session.service';
import { GameSession } from '../sessions/game-session.model';
import { GameTypesEnums } from '../../config/types/gameTypesEnums';
import appConfig from '../../config/app/appConfig';

@WebSocketGateway({
    namespace: '/game',
    cors: {
        origin: [appConfig().dev_origin, appConfig().prod_origin],
        credentials: true,
    },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private gameSessionService: GameSessionService) {}

    handleConnection(client: Socket, ...args: any[]) {
        console.log('Connect', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Disconnect:', client.id);
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any): string {
        console.log('MEssage', client.id, payload);
        return 'ReturnMessage';
    }

    @SubscribeMessage('createSession')
    createSession(client: Socket, gameType: GameTypesEnums): void {
        const session: GameSession = this.gameSessionService.createSession({
            gameType,
            playersIds: [client.id],
        });
        client.emit('sessionCreated', session);
    }

    @SubscribeMessage('joinSession')
    joinSession(client: Socket, sessionId: string): void {
        const session: GameSession = this.gameSessionService.joinSession(
            sessionId,
            client.id,
        );
        if (session) {
            client.to(sessionId).emit('playerJoined', session);
        } else {
            client.emit('error', 'Session not found');
        }
    }

    @SubscribeMessage('createGame')
    handleCreateGame(client: Socket, payload: any): void {
        const game = this.gameSessionService.createGame(payload.type);
        client.emit('gameCreated', game);
    }

    @SubscribeMessage('getGames')
    handleGetGames(client: Socket): void {
        const games = this.gameSessionService.getGames();
        client.emit('gamesList', games);
    }

    @SubscribeMessage('joinGame')
    handleJoinGame(client: Socket, payload: any): void {
        const result = this.gameSessionService.joinGame(payload.gameId);
        client.emit('gameJoined', result);
    }
}
