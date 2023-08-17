import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnums } from '@config/routes/routesEnums';
import { GameServerSocket } from '@config/http/sockets/game-server.socket';
import { BehaviorSubject, Subscription, tap } from 'rxjs';
import { GameTypesEnums } from '@config/types/game/gameTypesEnums';
import { LoginRequest } from '@config/types/auth/credentails.type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from '@shared/types/forms/form.interface';

interface MoveForm {
    row: string;
    col: string;
}

export interface GameResult {
    status: string;
}

export interface GameModelResponse {
    sessionId: string;
    ownerPlayerId: string;
    gameName: GameTypesEnums;
}

export interface GamesListResponse {
    availableGames: GameTypesEnums[];
    waitingGames: GameModelResponse[];
}

export interface GameList {
    id: string;
    gameName: string;
}

@Component({
    selector: 'mc-game-server',
    templateUrl: './game-server.component.html',
    styleUrls: ['./game-server.component.scss'],
})
export class GameServerComponent implements OnInit, OnDestroy {
    protected readonly RoutesEnums = RoutesEnums;
    protected readonly GameTypesEnums = GameTypesEnums;

    moveForm!: FormGroup<Form<MoveForm>>;

    messageSubscription!: Subscription;
    gamesListSubscription!: Subscription;
    gamesResultSubscription!: Subscription;
    sessionCreatedSubscription!: Subscription;

    gamesList$ = new BehaviorSubject<GameModelResponse[]>([]);

    sessionId!: string;
    gamesResult = new BehaviorSubject<string>('Await result');

    constructor(
        public router: Router,
        private socket: GameServerSocket,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this.moveForm = this.formBuilder.nonNullable.group({
            row: [''],
            col: [''],
        });
    }

    onServerConnect() {
        this.socket.connect();

        this.messageSubscription = this.socket
            .fromEvent<string>('message')
            .subscribe({
                next: (response: string) => {
                    console.log('$FromServer:', response);
                },
            });

        this.gamesListSubscription = this.socket
            .fromEvent<GamesListResponse>('gameList')
            .subscribe((gameList: GamesListResponse) => {
                const forJoin = gameList.waitingGames;

                this.gamesList$.next(forJoin);
                console.log('$FromServer:', gameList);
            });

        this.gamesResultSubscription = this.socket
            .fromEvent<GameResult>('gameResult')
            .subscribe((response) => {
                this.gamesResult.next(response.status);
            });

        this.sessionCreatedSubscription = this.socket
            .fromEvent<string>('sessionCreated')
            .subscribe((response) => {
                this.sessionId = response;
                console.log('SessionId', response);
            });
    }

    onServerDisconnect() {
        this.socket.disconnect();
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }

        if (this.gamesListSubscription) {
            this.gamesListSubscription.unsubscribe();
        }
    }

    onSendMessage() {
        console.log('#');
        this.socket.emit('message', 'test from Angular');
    }

    getGames() {
        this.socket.emit('getGames');
    }

    createGame(gameType: string) {
        this.socket.emit('createSession', gameType);
    }

    joinGame(sessionId: string) {
        this.sessionId = sessionId;
        this.socket.emit('joinSession', sessionId);
    }

    onMove() {
        const { row, col } = this.moveForm.getRawValue();
        console.log(row, col, this.sessionId);
        this.socket.emit('makeMove', { row, col, sessionId: this.sessionId });
    }

    ngOnDestroy() {
        this.onServerDisconnect();
    }
}
