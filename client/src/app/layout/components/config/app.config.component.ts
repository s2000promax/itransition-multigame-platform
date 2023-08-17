import { Component, OnInit } from '@angular/core';
import { LayoutService } from '@services/app.layout.service';
import { ThemeStyles } from '@config/styles/themesStyles';
import { ColorStyles } from '@config/styles/colorStyles';
import { Languages } from '@config/language/languages';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
})
export class AppConfigComponent implements OnInit {
    protected readonly ThemeStyles = ThemeStyles;
    protected readonly ColorsStyles = ColorStyles;
    protected readonly Languages = Languages;

    languageItems!: Array<{
        src: string;
        language: Languages;
    }>;

    themesItems!: Array<{
        src: string;
        themeStyle: ThemeStyles;
        colorStyle: ColorStyles;
    }>;

    constructor(
        public layoutService: LayoutService,
        public translate: TranslateService,
    ) {}

    ngOnInit() {
        this.initializeLanguagesItems();
        this.initializeThemesItems();
    }

    private initializeLanguagesItems(): void {
        this.languageItems = [
            { language: Languages.ENG, src: 'usa.png' },
            { language: Languages.BEL, src: 'belarus.png' },
            { language: Languages.PL, src: 'poland.png' },
            { language: Languages.GE, src: 'georgia.png' },
        ];
    }

    private initializeThemesItems(): void {
        this.themesItems = [
            {
                themeStyle: ThemeStyles.LIGHT_INDIGO,
                colorStyle: ColorStyles.LIGHT,
                src: 'lara-light-indigo.png',
            },
            {
                themeStyle: ThemeStyles.LIGHT_BLUE,
                colorStyle: ColorStyles.LIGHT,
                src: 'lara-light-blue.png',
            },
            {
                themeStyle: ThemeStyles.LIGHT_PURPLE,
                colorStyle: ColorStyles.LIGHT,
                src: 'lara-light-purple.png',
            },
            {
                themeStyle: ThemeStyles.LIGHT_TEAL,
                colorStyle: ColorStyles.LIGHT,
                src: 'lara-light-teal.png',
            },
            {
                themeStyle: ThemeStyles.DARK_INDIGO,
                colorStyle: ColorStyles.DARK,
                src: 'lara-dark-indigo.png',
            },
            {
                themeStyle: ThemeStyles.DARK_BLUE,
                colorStyle: ColorStyles.DARK,
                src: 'lara-dark-blue.png',
            },
            {
                themeStyle: ThemeStyles.DARK_PURPLE,
                colorStyle: ColorStyles.DARK,
                src: 'lara-dark-purple.png',
            },
            {
                themeStyle: ThemeStyles.DARK_TEAL,
                colorStyle: ColorStyles.DARK,
                src: 'lara-dark-teal.png',
            },
        ];
    }

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
        this.layoutService.onConfigUpdate();
    }

    changeTheme(theme: ThemeStyles, colorScheme: ColorStyles): void {
        this.layoutService.changeTheme(theme, colorScheme);
    }

    changeLanguage(newLanguage: Languages): void {
        this.layoutService.changeLanguage(newLanguage);
    }
}
