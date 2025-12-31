import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ListItemPresentationModel } from '../../models/ListItemPresentationModel';
import { useAppTheme } from '../../theme/ThemeContext';

interface ListItemProps {
    item: ListItemPresentationModel;
    index: number;
    onPress: (item: ListItemPresentationModel) => void;
}

export const ListItem = React.memo(({ item, index, onPress }: ListItemProps) => {
    const { colors } = useAppTheme();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}
            onPress={() => onPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <Text style={[styles.number, { color: colors.accent }]}>{index + 1}</Text>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 12,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        minHeight: 64,
    },
    number: {
        fontSize: 16,
        fontWeight: '600',
        minWidth: 32,
    },
    title: {
        flex: 1,
        fontSize: 17,
        marginLeft: 12,
        fontWeight: '500',
    },
    arrow: {
        fontSize: 24,
        marginLeft: 8,
    },
});
