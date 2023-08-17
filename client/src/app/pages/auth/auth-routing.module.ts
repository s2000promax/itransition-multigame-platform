import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnums } from '@config/routes/routesEnums';

const routes: Routes = [
    {
        path: RoutesEnums.AUTH_ERROR,
        loadChildren: () =>
            import('./error/error.module').then((module) => module.ErrorModule),
    },
    {
        path: RoutesEnums.AUTH_ACCESS,
        loadChildren: () =>
            import('./access/access.module').then(
                (module) => module.AccessModule,
            ),
    },
    {
        path: RoutesEnums.AUTH_LOGIN,
        loadChildren: () =>
            import('./login/login.module').then((module) => module.LoginModule),
    },
    {
        path: RoutesEnums.AUTH_REGISTER,
        loadChildren: () =>
            import('./register/register.module').then(
                (module) => module.RegisterModule,
            ),
    },
    { path: '**', redirectTo: RoutesEnums.ERROR_REDIRECT },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
