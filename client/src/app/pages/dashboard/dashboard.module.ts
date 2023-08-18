import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, DashboardsRoutingModule, ButtonModule],
    exports: [],
})
export class DashboardModule {}
