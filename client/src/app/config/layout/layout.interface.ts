import { ThemeStyles } from '../styles/themesStyles';
import { ColorStyles } from '../styles/colorStyles';
import { Languages } from '../language/languages';

export interface LayoutInterface {
    theme: ThemeStyles;
    colorScheme: ColorStyles;
    language: Languages;
}
