import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import useDetailsStore from '../store/useDetailsStore';

export default function DetailsScreen({ route, navigation }) {
    const { title, id } = route.params;

    const detail = useDetailsStore(state => state.detail);
    const viewCount = useDetailsStore(state => state.viewCount);
    const isLoading = useDetailsStore(state => state.isLoading);
    const error = useDetailsStore(state => state.error);
    const getItemDetails = useDetailsStore(state => state.getItemDetails);
    const clearError = useDetailsStore(state => state.clearError);
    const reset = useDetailsStore(state => state.reset);

    useEffect(() => {

        getItemDetails(id);

        return () => {
            reset();
        };
    }, [id, getItemDetails, reset]);

    const retry = () => {
        clearError();
        getItemDetails(id);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.6}
                >
                    <Text style={styles.backButtonText}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>Details</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
            >
                {}
                <View style={styles.titleCard}>
                    <Text style={styles.label}>Title</Text>
                    <Text style={styles.title}>
                        {detail ? detail.title : title}
                    </Text>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                        <Text style={styles.loadingText}>Loading details...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorIcon}>⚠️</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={retry} style={styles.retryButton}>
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                ) : detail ? (
                    <>
                        {}
                        <View style={styles.contentCard}>
                            <Text style={styles.label}>Description</Text>
                            <Text style={styles.detailText}>{detail.text}</Text>
                        </View>

                        {}
                        <View style={styles.counterCard}>
                            <Text style={styles.counterLabel}>Live Readers</Text>
                            <Text style={styles.counterValue}>👀 {viewCount}</Text>
                        </View>

                        {}
                        <View style={styles.techCard}>
                            <Text style={styles.techEmoji}>🏗️</Text>
                            <Text style={styles.techTitle}>Clean Architecture</Text>
                            <Text style={styles.techDescription}>
                                Data loaded via:
                                {'\n'}📱 Presentation → UseCase → Repository → DataSource
                                {'\n\n'}All layers are isolated and depend only on abstractions
                            </Text>
                        </View>
                    </>
                ) : null}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingTop: 50,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    backButton: {
        paddingVertical: 8,
        paddingRight: 12,
    },
    backButtonText: {
        fontSize: 34,
        color: '#007AFF',
        fontWeight: '400',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000000',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#8E8E93',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    titleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    counterCard: {
        backgroundColor: '#FF2D55',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    counterLabel: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        opacity: 0.9,
        marginBottom: 4,
    },
    counterValue: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    contentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    techCard: {
        backgroundColor: '#34C759',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    techEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    techTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    techDescription: {
        fontSize: 15,
        color: '#FFFFFF',
        opacity: 0.95,
        textAlign: 'center',
        lineHeight: 22,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',
        lineHeight: 34,
    },
    detailText: {
        fontSize: 17,
        lineHeight: 24,
        color: '#000000',
        textAlign: 'justify',
    },
});
