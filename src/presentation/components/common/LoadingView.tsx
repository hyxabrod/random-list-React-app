import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';

interface LoadingViewProps {
    message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ message = 'Loading...' }) => {
    const { colors } = useAppTheme();

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.text, { color: colors.textSecondary }]}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 12,
        fontSize: 16,
    },
});
