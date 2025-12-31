import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';

interface ErrorViewProps {
    message?: string;
    onRetry?: () => void;
    retryText?: string;
    icon?: string;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
    message = 'An error occurred',
    onRetry,
    retryText = 'Try Again',
    icon = '⚠️'
}) => {
    const { colors } = useAppTheme();

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.text, { color: colors.textSecondary }]}>{message}</Text>
            {onRetry && (
                <TouchableOpacity onPress={onRetry} style={[styles.button, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.buttonText, { color: 'white' }]}>{retryText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    icon: {
        fontSize: 48,
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
