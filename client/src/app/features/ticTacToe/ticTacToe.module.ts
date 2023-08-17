import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicTacToeComponent } from './ticTacToe.component';
import { TicTacToeRoutingModule } from '@features/ticTacToe/ticTacToe-routing.module';

@NgModule({
    declarations: [TicTacToeComponent],
    imports: [CommonModule, TicTacToeRoutingModule],
    exports: [TicTacToeComponent],
})
export class TicTacToeModule {}
