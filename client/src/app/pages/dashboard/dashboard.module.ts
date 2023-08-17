import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard.component';
import { DashboardsRoutingModule } from './dashboard-routing.module';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, DashboardsRoutingModule],
    exports: [],
})
export class DashboardModule {}
