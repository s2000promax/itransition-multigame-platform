import { Component } from '@angular/core';
import { RoutesEnums } from '@config/routes/routesEnums';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
    protected readonly RoutesEnums = RoutesEnums;
}
