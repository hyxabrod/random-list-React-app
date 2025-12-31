import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import { ThemeColors, getThemeColors, LightColors, DarkColors } from './ThemeColors';

interface ThemeContextType {
    theme: ColorSchemeName;
    colors: ThemeColors;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    colors: LightColors,
    isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const colorScheme = useColorScheme();

    const themeData = useMemo(() => {
        const colors = getThemeColors(colorScheme);
        return {
            theme: colorScheme,
            colors: colors,
            isDark: colorScheme === 'dark',
        };
    }, [colorScheme]);

    return (
        <ThemeContext.Provider value={themeData}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(ThemeContext);
