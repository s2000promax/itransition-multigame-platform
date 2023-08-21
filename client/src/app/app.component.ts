import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { RoutesEnums } from '@config/routes/routesEnums';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor(
        private auth: AuthService,
        private router: Router,
    ) {
        if (!this.auth.isAuthenticated()) {
            this.router.navigate([RoutesEnums.AUTH_LOGIN]);
        } else {
            this.router.navigate([RoutesEnums.DASHBOARD]);
        }
    }
}
