import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';

interface InfoCardProps {
    title: string;
    content: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, content }) => {
    const { colors } = useAppTheme();
    return (
        <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{title}</Text>
            <Text style={[styles.content, { color: colors.text }]}>{content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    content: {
        fontSize: 17,
        lineHeight: 24,
    },
});
