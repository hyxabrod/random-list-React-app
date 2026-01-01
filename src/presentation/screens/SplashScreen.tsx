import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

export const SplashScreen = () => {
    const { colors } = useAppTheme();
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const blink = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ])
        );

        blink.start();

        return () => blink.stop();
    }, [opacity]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.Text style={[styles.text, { color: colors.text, opacity }]}>
                Random Strings
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 40,
        fontWeight: '700',
    },
});
