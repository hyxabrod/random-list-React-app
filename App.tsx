
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import ListScreen from './src/presentation/screens/ListScreen';
import DetailsScreen from './src/presentation/screens/DetailsScreen';
import { RootStackParamList } from './src/presentation/navigation/types';
import { View } from 'react-native';

import { useColorScheme } from 'react-native';
import { ThemeProvider, useAppTheme } from './src/presentation/theme/ThemeContext';
import { LightColors, DarkColors } from './src/presentation/theme/ThemeColors';
import { DefaultTheme, DarkTheme as NavigationDarkTheme, Theme } from '@react-navigation/native';

import { SplashScreen } from './src/presentation/screens/SplashScreen';

const Stack = createStackNavigator<RootStackParamList>();

function AppContent() {
    const { isDark, colors } = useAppTheme();
    const [showSplash, setShowSplash] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const navigationTheme: Theme = {
        ...(isDark ? NavigationDarkTheme : DefaultTheme),
        colors: {
            ...(isDark ? NavigationDarkTheme.colors : DefaultTheme.colors),
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.separator,
            primary: colors.accent,
        },
    };

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <NavigationContainer theme={navigationTheme}>
                <Stack.Navigator
                    initialRouteName="List"
                    screenOptions={{
                        headerShown: false,
                        cardStyle: { backgroundColor: 'transparent' },
                        ...TransitionPresets.SlideFromRightIOS,
                    }}
                >
                    <Stack.Screen
                        name="List"
                        component={ListScreen}
                        options={{ title: 'List' }}
                    />
                    <Stack.Screen
                        name="Details"
                        component={DetailsScreen}
                        options={{
                            title: 'Details',
                            presentation: 'transparentModal',
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}
