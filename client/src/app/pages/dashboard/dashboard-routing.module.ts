import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { authGuard } from '@config/http/guards/auth.guard';
import { RoutesEnums } from '@config/routes/routesEnums';
import { GameServerComponent } from '@pages/gameServer/component/game-server.component';

const routes: Routes = [
    // { path: '', component: DashboardComponent, canActivate: [authGuard] },
    { path: RoutesEnums.MAIN, component: DashboardComponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardsRoutingModule {}
