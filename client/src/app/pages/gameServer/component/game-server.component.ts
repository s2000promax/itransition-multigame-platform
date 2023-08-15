import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnums } from '@config/routes/routesEnums';
import { GameServerSocket } from '@config/http/sockets/game-server.socket';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';

@UntilDestroy({
    checkProperties: true,
})
@Component({
    selector: 'mc-game-server',
    templateUrl: './game-server.component.html',
    styleUrls: ['./game-server.component.scss'],
})
export class GameServerComponent implements OnDestroy {
    protected readonly RoutesEnums = RoutesEnums;

    gamesList$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    constructor(
        public router: Router,
        private socket: GameServerSocket,
    ) {}

    onServerConnect() {
        this.socket.connect();
    }

    onServerDisconnect() {
        this.socket.disconnect();
    }

    getGames() {
        this.socket.emit('getGames');
        this.onGamesList();
    }

    onGamesList() {
        this.socket.fromEvent<string[]>('gamesList').subscribe((list) => {
            console.log(list);
            this.gamesList$.next(list);
        });
    }

    createGame(gameType: string) {
        this.socket.emit('createGame', { type: gameType });
    }

    joinGame(gameId: string) {
        this.socket.emit('joinGame', { gameId });
    }

    ngOnDestroy() {
        this.socket.disconnect();
    }
}
