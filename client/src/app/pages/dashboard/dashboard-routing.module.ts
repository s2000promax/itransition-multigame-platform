import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { RoutesEnums } from '@config/routes/routesEnums';

const routes: Routes = [
    { path: RoutesEnums.MAIN, component: DashboardComponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardsRoutingModule {}
