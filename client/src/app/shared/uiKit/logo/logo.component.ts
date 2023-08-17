import { Component } from '@angular/core';
import { RoutesEnums } from '@config/routes/routesEnums';
import { LayoutService } from '@services/app.layout.service';

@Component({
    selector: 'mc-logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.components.scss'],
})
export class LogoComponent {
    protected readonly RoutesEnums = RoutesEnums;
    constructor(public layoutService: LayoutService) {}
}
