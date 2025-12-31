
import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useDetailsStore from '../store/useDetailsStore';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

import { useAppTheme } from '../theme/ThemeContext';
import { LoadingView } from '../components/common/LoadingView';
import { ErrorView } from '../components/common/ErrorView';
import { InfoCard } from '../components/details/InfoCard';
import { TechCard } from '../components/details/TechCard';

export default function DetailsScreen({ route, navigation }: Props) {
    const { colors } = useAppTheme();
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
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar barStyle={colors.statusBarStyle} />

            {/* Header */}
            <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.separator }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.6}
                >
                    <Text style={[styles.backButtonText, { color: colors.accent }]}>‹</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>Details</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
            >
                {/* Title */}
                <InfoCard
                    title="Title"
                    content={detail ? detail.title : title}
                />

                {isLoading ? (
                    <LoadingView message="Loading details..." />
                ) : error ? (
                    <ErrorView message={error} onRetry={retry} />
                ) : detail ? (
                    <>
                        <InfoCard
                            title="Description"
                            content={detail.text}
                        />

                        {/* View Counter */}
                        <View style={[styles.counterCard, { backgroundColor: '#FF2D55', shadowColor: colors.cardShadow }]}>
                            <Text style={styles.counterLabel}>Live Readers</Text>
                            <Text style={styles.counterValue}>👀 {viewCount}</Text>
                        </View>

                        <TechCard
                            title="Clean Architecture"
                            emoji="🏗️"
                            description={`Data loaded via:\n📱 Presentation → UseCase → Repository → DataSource\n\nAll layers are isolated and depend only on abstractions`}
                        />
                    </>
                ) : null}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        paddingVertical: 8,
        paddingRight: 12,
    },
    backButtonText: {
        fontSize: 34,
        fontWeight: '400',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 60,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    counterCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
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
});
