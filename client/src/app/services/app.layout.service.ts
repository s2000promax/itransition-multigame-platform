import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { LayoutStateInterface } from '@config/layout/layoutState.interface';
import { ColorStyles } from '@config/styles/colorStyles';
import { ThemeStyles } from '@config/styles/themesStyles';
import { Languages } from '@config/language/languages';

import { PersistenceService } from '@services/persistence.service';
import { LocalStorageEnums } from '@config/localStorage/localStorageEnums';
import { LayoutInterface } from '@config/layout/layout.interface';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    config!: LayoutInterface;

    state: LayoutStateInterface = {
        menuSidebarVisible: false,
        configSidebarVisible: false,
    };

    private configUpdate = new Subject<LayoutInterface>();

    private overlayOpen = new Subject<any>();

    overlayOpen$ = this.overlayOpen.asObservable();

    constructor(
        private translate: TranslateService,
        private persistenceService: PersistenceService,
    ) {
        const savedConfig: LayoutInterface = this.persistenceService.get(
            LocalStorageEnums.APP_CONFIG,
        );
        if (savedConfig) {
            this.config = savedConfig;
        } else {
            this.config = {
                theme: ThemeStyles.LIGHT_INDIGO,
                colorScheme: ColorStyles.LIGHT,
                language: Languages.ENG,
            };
        }
        this.changeLanguage(this.config.language);
        this.changeTheme(this.config.theme, this.config.colorScheme);
    }

    showMenuSidebar() {
        this.state.menuSidebarVisible = !this.state.menuSidebarVisible;
        if (this.state.menuSidebarVisible) {
            this.overlayOpen.next(null);
        }
    }

    showConfigSidebar() {
        this.state.configSidebarVisible = true;
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    onConfigUpdate() {
        this.configUpdate.next(this.config);
        this.persistenceService.set(LocalStorageEnums.APP_CONFIG, this.config);
    }

    changeTheme(theme: ThemeStyles, colorScheme: ColorStyles) {
        const currentLink = <HTMLLinkElement>(
            document.getElementById('theme-css')
        );
        if (currentLink) {
            const newHref = `assets/layout/styles/theme/${theme}/theme.css`;
            this.replaceThemeLink(newHref, () => {
                this.config.theme = theme;
                this.config.colorScheme = colorScheme;
                this.onConfigUpdate();
            });
        } else {
            const newLink = <HTMLLinkElement>document.createElement('link');
            newLink.setAttribute('id', 'theme-css');
            newLink.setAttribute('rel', 'stylesheet');
            newLink.setAttribute('type', 'text/css');
            newLink.setAttribute(
                'href',
                `assets/layout/styles/theme/${theme}/theme.css`,
            );

            const header = <HTMLHeadElement>document.querySelector('head');
            if (header) {
                header.append(newLink);
            }
        }
    }

    changeLanguage(newLanguage: Languages) {
        this.translate.use(newLanguage);
        this.config.language = newLanguage;
        this.onConfigUpdate();
    }

    replaceThemeLink(href: string, onComplete: Function) {
        const id = 'theme-css';
        const themeLink = <HTMLLinkElement>document.getElementById(id);
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');
        themeLink.parentNode!.insertBefore(
            cloneLinkElement,
            themeLink.nextSibling,
        );

        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();

            cloneLinkElement.setAttribute('id', id);

            onComplete();
        });
    }
}
