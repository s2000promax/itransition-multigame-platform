import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '@services/app.layout.service';
import { RoutesEnums } from '@config/routes/routesEnums';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({
    checkProperties: true,
})
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
    protected readonly RoutesEnums = RoutesEnums;

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        public authService: AuthService,
        private router: Router,
    ) {}

    onConfigButtonClick(): void {
        this.layoutService.showConfigSidebar();
    }

    onLogin() {
        return this.router.navigate([RoutesEnums.AUTH, RoutesEnums.AUTH_LOGIN]);
    }

    onLogout() {
        this.authService.logout().subscribe();
        return this.router.navigate([RoutesEnums.AUTH, RoutesEnums.AUTH_LOGIN]);
    }
}
