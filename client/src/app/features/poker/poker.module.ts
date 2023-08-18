import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokerComponent } from './poker.component';
import { PokerRoutingModule } from '@features/poker/poker-routing.module';

@NgModule({
    declarations: [PokerComponent],
    imports: [CommonModule, PokerRoutingModule],
    exports: [PokerComponent],
})
export class PokerModule {}
