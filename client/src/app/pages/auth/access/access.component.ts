import { Component } from '@angular/core';
import { RoutesEnums } from '@config/routes/routesEnums';

@Component({
    selector: 'app-access',
    templateUrl: './access.component.html',
    styleUrls: ['./access.component.scss'],
})
export class AccessComponent {
    protected readonly RoutesEnums = RoutesEnums;
}
