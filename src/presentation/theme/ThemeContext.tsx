import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { useColorScheme, ColorSchemeName, Appearance } from 'react-native';
import { ThemeColors, getThemeColors, LightColors } from './ThemeColors';

interface ThemeContextType {
    theme: ColorSchemeName;
    colors: ThemeColors;
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    colors: LightColors,
    isDark: false,
    toggleTheme: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useState<ColorSchemeName>(systemScheme);

    useEffect(() => {
        setColorScheme(systemScheme);

        const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
            setColorScheme(newScheme);
        });

        return () => subscription.remove();
    }, [systemScheme]);

    const toggleTheme = React.useCallback(() => {
        setColorScheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const themeData = useMemo(() => {
        const currentScheme = colorScheme || 'light';
        const colors = getThemeColors(currentScheme);
        return {
            theme: currentScheme,
            colors: colors,
            isDark: currentScheme === 'dark',
            toggleTheme: toggleTheme,
        };
    }, [colorScheme, toggleTheme]);

    return (
        <ThemeContext.Provider value={themeData}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(ThemeContext);
