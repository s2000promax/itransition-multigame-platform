import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnums } from '@config/routes/routesEnums';
import { Observable } from 'rxjs';
import { GameTypesEnums } from '@config/types/game/gameTypesEnums';
import { GameServerService } from '../services/game-server.service';
import { GameModelResponse } from '../types/game-server.type';

@Component({
    selector: 'mc-game-server',
    templateUrl: './game-server.component.html',
    styleUrls: ['./game-server.component.scss'],
})
export class GameServerComponent implements OnInit, OnDestroy {
    availableGamesList$!: Observable<GameTypesEnums[]>;
    waitingGamesList$!: Observable<GameModelResponse[]>;

    constructor(
        public router: Router,
        private gameServerService: GameServerService,
    ) {}

    ngOnInit() {
        this.gameServerService.onServerConnect();

        this.availableGamesList$ = this.gameServerService.availableGamesList$;
        this.waitingGamesList$ = this.gameServerService.waitingGamesList$;
    }

    onCreateGame(gameType: GameTypesEnums) {
        this.gameServerService.onCreateSession(gameType);
        return this.router.navigate([
            RoutesEnums.GAME_SERVER,
            gameType,
        ]);
    }

    onJoinGame(game: GameModelResponse) {
        this.gameServerService.onJoinSession(game.sessionId);
        return this.router.navigate([
            RoutesEnums.GAME_SERVER,
            game.gameName,
        ]);
    }

    onLeaveServer() {
        this.gameServerService.onServerDisconnect();
        return this.router.navigate([RoutesEnums.DASHBOARD]);
    }

    ngOnDestroy() {}
}
