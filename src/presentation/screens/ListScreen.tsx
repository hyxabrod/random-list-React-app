
import React, { useEffect } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
    ListRenderItem
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useListStore from '../store/useListStore';
import { RootStackParamList } from '../navigation/types';
import { ListItemPresentationModel } from '../models/ListItemPresentationModel';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

import { useAppTheme } from '../theme/ThemeContext';
import { ListItem } from '../components/list/ListItem';
import { LoadingView } from '../components/common/LoadingView';
import { ErrorView } from '../components/common/ErrorView';

export default function ListScreen({ navigation }: Props) {
    const { colors } = useAppTheme();
    const items = useListStore((state) => state.items);
    const isLoadingMore = useListStore((state) => state.isLoadingMore);
    const isRefreshing = useListStore((state) => state.isRefreshing);
    const error = useListStore((state) => state.error);

    const initialize = useListStore((state) => state.initialize);
    const loadMoreItems = useListStore((state) => state.loadMoreItems);
    const refreshItems = useListStore((state) => state.refreshItems);
    const clearError = useListStore((state) => state.clearError);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const handleItemPress = React.useCallback((item: ListItemPresentationModel) => {
        navigation.navigate('Details', {
            title: item.title,
            id: item.id
        });
    }, [navigation]);

    const renderItem: ListRenderItem<ListItemPresentationModel> = React.useCallback(({ item, index }) => (
        <ListItem
            item={item}
            index={index}
            onPress={handleItemPress}
        />
    ), [handleItemPress]);

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.accent} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
            </View>
        );
    };

    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.separator }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Random Strings</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {items.length} items • Clean Architecture
            </Text>
            {error && (
                <View style={{ marginTop: 12 }}>
                    <ErrorView
                        message={error}
                        onRetry={clearError}
                        retryText="Close"
                        icon="⚠️"
                    />
                </View>
            )}
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <ErrorView
                message="List is empty"
                onRetry={initialize}
                retryText="Try Again"
                icon=""
            />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar barStyle={colors.statusBarStyle} />
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                onEndReached={loadMoreItems}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={!isRefreshing ? renderEmpty : null}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={true}
                initialNumToRender={20}
                maxToRenderPerBatch={10}
                windowSize={10}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={refreshItems}
                        tintColor={colors.accent}
                        colors={[colors.accent]}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 20,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 24,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '700',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
        marginTop: 4,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        fontSize: 14,
    },
    emptyContainer: {
        paddingTop: 40,
    },
});
