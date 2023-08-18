import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeaBattleComponent } from './seaBattle.component';
import { SeaBattleRoutingModule } from '@features/seaBattle/seaBattle-routing.module';

@NgModule({
    declarations: [SeaBattleComponent],
    imports: [CommonModule, SeaBattleRoutingModule],
    exports: [SeaBattleComponent],
})
export class SeaBattleModule {}
