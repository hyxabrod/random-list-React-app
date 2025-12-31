import { ColorSchemeName } from 'react-native';

export interface ThemeColors {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    error: string;
    errorBackground: string;
    separator: string;
    cardShadow: string;
    statusBarStyle: 'dark-content' | 'light-content';
}

export const LightColors: ThemeColors = {
    background: '#F5F5F7',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    accent: '#007AFF',
    error: '#D32F2F',
    errorBackground: '#FFE5E5',
    separator: '#E5E5EA',
    cardShadow: '#000000',
    statusBarStyle: 'dark-content',
};

export const DarkColors: ThemeColors = {
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    accent: '#0A84FF',
    error: '#FF453A',
    errorBackground: '#3A0F0F',
    separator: '#38383A',
    cardShadow: '#000000',
    statusBarStyle: 'light-content',
};

export const getThemeColors = (scheme: ColorSchemeName): ThemeColors => {
    return scheme === 'dark' ? DarkColors : LightColors;
};
