import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { RoutesEnums } from '@config/routes/routesEnums';

export const authGuard: CanActivateFn = (route, state) => {
    if (inject(AuthService).isAuthenticated()) {
        return true;
    } else {
        inject(Router).navigate([RoutesEnums.AUTH, RoutesEnums.AUTH_LOGIN]);

        return false;
    }
};
