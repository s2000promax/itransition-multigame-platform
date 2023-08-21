import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnums } from '@config/routes/routesEnums';
import { GameServerComponent } from '@pages/gameServer/component/game-server.component';

const routes: Routes = [
    { path: RoutesEnums.MAIN, component: GameServerComponent },
    {
        path: RoutesEnums.TIC_TAC_TOE,
        loadChildren: () =>
            import('@features/ticTacToe/ticTacToe.module').then(
                (module) => module.TicTacToeModule,
            ),
    },
    {
        path: RoutesEnums.SEA_BATTLE,
        loadChildren: () =>
            import('@features/seaBattle/seaBattle.module').then(
                (module) => module.SeaBattleModule,
            ),
    },
    {
        path: RoutesEnums.POKER,
        loadChildren: () =>
            import('@features/poker/poker.module').then(
                (module) => module.PokerModule,
            ),
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GameServerRoutingModule {}
