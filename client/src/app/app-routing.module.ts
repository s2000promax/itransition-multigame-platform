import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnums } from '@config/routes/routesEnums';
import { AppLayoutComponent } from '@layout/app.layout.component';
import { Error404Component } from '@shared/uiKit/error404/error404.component';

const routes: Routes = [
    {
        path: RoutesEnums.MAIN,
        component: AppLayoutComponent,
        children: [
            {
                path: RoutesEnums.MAIN,
                redirectTo: RoutesEnums.DASHBOARD,
                pathMatch: 'full',
            },
            {
                path: RoutesEnums.DASHBOARD,
                loadChildren: () =>
                    import('@pages/dashboard/dashboard.module').then(
                        (module) => module.DashboardModule,
                    ),
            },
            {
                path: RoutesEnums.GAME_SERVER,
                loadChildren: () =>
                    import('@pages/gameServer/game-server.module').then(
                        (module) => module.GameServerModule,
                    ),
            },
        ],
    },
    {
        path: RoutesEnums.AUTH,
        loadChildren: () =>
            import('@pages/auth/auth.module').then(
                (module) => module.AuthModule,
            ),
    },
    { path: RoutesEnums.ERROR_404, component: Error404Component },
    { path: '**', redirectTo: RoutesEnums.ERROR_REDIRECT },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
