import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeaBattleComponent } from '@features/seaBattle/seaBattle.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: SeaBattleComponent }]),
    ],
    exports: [RouterModule],
})
export class SeaBattleRoutingModule {}
