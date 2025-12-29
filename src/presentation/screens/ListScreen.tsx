
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

export default function ListScreen({ navigation }: Props) {

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

    const renderItem: ListRenderItem<ListItemPresentationModel> = ({ item, index }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('Details', {
                title: item.title,
                id: item.id
            })}
            activeOpacity={0.7}
        >
            <View style={styles.itemContent}>
                <Text style={styles.itemNumber}>{index + 1}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.arrow}>›</Text>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Random Strings</Text>
            <Text style={styles.headerSubtitle}>
                {items.length} items • Clean Architecture
            </Text>
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                    <TouchableOpacity onPress={clearError} style={styles.errorButton}>
                        <Text style={styles.errorButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>List is empty</Text>
            <TouchableOpacity onPress={initialize} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
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
                        tintColor="#007AFF"
                        colors={['#007AFF']}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    listContent: {
        paddingBottom: 20,
    },
    header: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        paddingTop: 60,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#8E8E93',
        marginTop: 4,
    },
    errorContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#FFE5E5',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        flex: 1,
    },
    errorButton: {
        marginLeft: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#D32F2F',
        borderRadius: 6,
    },
    errorButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    itemContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        minHeight: 64,
    },
    itemNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
        minWidth: 32,
    },
    itemTitle: {
        flex: 1,
        fontSize: 17,
        color: '#000000',
        marginLeft: 12,
        fontWeight: '500',
    },
    arrow: {
        fontSize: 24,
        color: '#C7C7CC',
        marginLeft: 8,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        color: '#8E8E93',
        fontSize: 14,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 17,
        color: '#8E8E93',
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
