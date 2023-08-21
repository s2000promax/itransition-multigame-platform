import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PokerComponent } from '@features/poker/poker.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: PokerComponent }])],
    exports: [RouterModule],
})
export class PokerRoutingModule {}
