import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';

interface TechCardProps {
    title: string;
    description: string;
    emoji: string;
}

export const TechCard: React.FC<TechCardProps> = ({ title, description, emoji }) => {
    const { colors } = useAppTheme();
    return (
        <View style={[styles.card, { backgroundColor: '#34C759', shadowColor: colors.cardShadow }]}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    emoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#FFFFFF',
        opacity: 0.95,
        textAlign: 'center',
        lineHeight: 22,
    },
});
