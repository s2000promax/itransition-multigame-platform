import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';
import { ButtonModule } from 'primeng/button';
import { LogoModule } from '@shared/uiKit/logo/logo.module';
import { RippleModule } from 'primeng/ripple';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        ErrorRoutingModule,
        ButtonModule,
        LogoModule,
        RippleModule,
        TranslateModule,
    ],
    declarations: [ErrorComponent],
})
export class ErrorModule {}
