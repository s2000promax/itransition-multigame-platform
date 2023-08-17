import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TicTacToeComponent } from '@features/ticTacToe/ticTacToe.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: TicTacToeComponent }]),
    ],
    exports: [RouterModule],
})
export class TicTacToeRoutingModule {}
