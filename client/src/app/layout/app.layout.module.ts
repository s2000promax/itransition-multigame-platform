import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigModule } from '@layout/components/config/app.config.module';
import { AppTopbarModule } from '@layout/components/topbar/app.topbar.module';
import { AppLayoutComponent } from './app.layout.component';
import { FooterModule } from '@shared/uiKit/footer/footer.module';

@NgModule({
    declarations: [AppLayoutComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,
        AppTopbarModule,
        AppConfigModule,
        TranslateModule,
        FooterModule,
    ],
    exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
