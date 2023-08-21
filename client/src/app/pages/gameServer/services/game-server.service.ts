import { Injectable } from '@angular/core';
import { GameServerSocket } from '@config/http/sockets/game-server.socket';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { GameTypesEnums } from '@config/types/game/gameTypesEnums';
import { AuthService } from '@services/auth.service';
import {
    CreateSessionRequest,
    GameModelResponse,
    GameSession,
    GamesListResponse,
    GameState,
    JoinSessionRequest,
    SessionResponse,
} from '../types/game-server.type';

@Injectable({
    providedIn: 'root',
})
export class GameServerService {
    myId$ = new BehaviorSubject('');

    sessionId$ = new BehaviorSubject<string>('');

    availableGamesListSubject = new Subject<GameTypesEnums[]>();
    availableGamesList$ = this.availableGamesListSubject.asObservable();

    waitingGamesListSubject = new Subject<GameModelResponse[]>();
    waitingGamesList$ = this.waitingGamesListSubject.asObservable();

    gameListSubscription!: Subscription;

    sessionSubscription!: Subscription;
    sessionCreatesSubscription!: Subscription;
    sessionJoinedSubscription!: Subscription;

    gameStateSubject = new Subject<GameState>();
    gameState$ = this.gameStateSubject.asObservable();
    gameStateSubscription!: Subscription;

    constructor(
        private socket: GameServerSocket,
        private auth: AuthService,
    ) {}

    onServerConnect() {
        this.socket.connect();

        this.gameListSubscription = this.socket
            .fromEvent<GamesListResponse>('gameList')
            .subscribe((gameList) => {
                this.availableGamesListSubject.next(gameList.availableGames);
                this.waitingGamesListSubject.next(gameList.waitingGames);
            });

        this.sessionCreatesSubscription = this.socket
            .fromEvent<SessionResponse>('sessionCreated')
            .subscribe((response) => {
                this.myId$.next(response[0]);
                this.sessionId$.next(response[1]);
            });

        this.sessionJoinedSubscription = this.socket
            .fromEvent<SessionResponse>('sessionJoined')
            .subscribe((response) => {
                this.myId$.next(response[0]);
                this.sessionId$.next(response[1]);
            });

        this.gameStateSubscription = this.socket
            .fromEvent<GameState>('gameState')
            .subscribe((gameState) => {
                this.gameStateSubject.next(gameState);
            });
    }

    onCreateSession(gameType: GameTypesEnums) {
        const data: CreateSessionRequest = {
            gameType,
            userName: this.auth.getUsername,
        };
        this.socket.emit('createSession', data);
    }

    onJoinSession(sessionId: string) {
        const data: JoinSessionRequest = {
            sessionId,
            userName: this.auth.getUsername,
        };
        // this.sessionId$.next(sessionId);
        this.socket.emit('joinSession', data);
    }

    onGetGameState() {
        console.log('SESSION ID', this.sessionId$.value);
        this.socket.emit('getState', this.sessionId$.value);
    }

    onMove(row: number, col: number) {
        const move = {
            sessionId: this.sessionId$.value,
            row,
            col,
        };
        this.socket.emit('makeMove', move);
    }

    onServerDisconnect() {
        this.socket.disconnect();
        this.gameListSubscription?.unsubscribe();
        this.sessionSubscription?.unsubscribe();
        this.gameStateSubscription?.unsubscribe();
        this.sessionCreatesSubscription?.unsubscribe();
        this.sessionJoinedSubscription?.unsubscribe();

        this.sessionId$.next('');
        this.myId$.next('');
    }
}
