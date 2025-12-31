import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { useColorScheme, ColorSchemeName, Appearance } from 'react-native';
import { ThemeColors, getThemeColors, LightColors } from './ThemeColors';

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
    // Initialize with current system appearance
    const systemScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useState<ColorSchemeName>(systemScheme);

    useEffect(() => {
        // Update state when system theme changes
        setColorScheme(systemScheme);

        // Add listener for appearance changes (redundant with useColorScheme usually, 
        // but ensures we catch updates if the hook lags)
        const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
            setColorScheme(newScheme);
        });

        return () => subscription.remove();
    }, [systemScheme]);

    const themeData = useMemo(() => {
        const currentScheme = colorScheme || 'light';
        const colors = getThemeColors(currentScheme);
        return {
            theme: currentScheme,
            colors: colors,
            isDark: currentScheme === 'dark',
        };
    }, [colorScheme]);

    return (
        <ThemeContext.Provider value={themeData}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(ThemeContext);
