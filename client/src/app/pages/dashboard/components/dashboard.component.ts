import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnums } from '@config/routes/routesEnums';

@Component({
    selector: 'mc-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
    constructor(private router: Router) {}

    onConnectToGameServer() {
        this.router.navigate([RoutesEnums.GAME_SERVER]);
    }
}
