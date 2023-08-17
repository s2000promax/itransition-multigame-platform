import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './logo.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@NgModule({
    declarations: [LogoComponent],
    imports: [CommonModule, TranslateModule, RouterLink],
    exports: [LogoComponent],
})
export class LogoModule {}
