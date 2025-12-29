
import { AppStateStatic, AppStateStatus } from 'react-native';
import { GetItemDetailUseCase } from '../../domain/usecases/GetItemDetailUseCase';
import { ObserveViewCountUseCase } from '../../domain/usecases/ObserveViewCountUseCase';
import { ItemDetailPresentationModel } from '../../presentation/models/ItemDetailPresentationModel';
import { Subscription } from 'rxjs';

export interface DetailsState {
    detailsCache: Map<string, ItemDetailPresentationModel>;
    detail: ItemDetailPresentationModel | null;
    viewCount: number;
    isLoading: boolean;
    error: string | null;
}

export class DetailsStoreController {

    private state: DetailsState;
    private listeners: Set<(state: DetailsState) => void>;
    private isPaused: boolean;
    private appStateSubscription: any;
    private countSubscription: Subscription | null = null;
    private activeItemId: string | null = null;

    constructor(
        private getItemDetailUseCase: GetItemDetailUseCase,
        private observeViewCountUseCase: ObserveViewCountUseCase,
        private appState: AppStateStatic
    ) {
        this.state = {
            detailsCache: new Map(),
            detail: null,
            viewCount: 0,
            isLoading: false,
            error: null,
        };

        this.listeners = new Set();
        this.isPaused = false;
        this.appStateSubscription = this.appState.addEventListener('change', this._handleAppStateChange.bind(this));
    }

    getState(): DetailsState {
        return this.state;
    }

    subscribe(listener: (state: DetailsState) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private _setState(updater: Partial<DetailsState> | ((prevState: DetailsState) => Partial<DetailsState>)) {
        const newState = typeof updater === 'function'
            ? updater(this.state)
            : updater;

        this.state = { ...this.state, ...newState };
        this._notifyListeners();
    }

    private _notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }

    private _handleAppStateChange(nextAppState: AppStateStatus) {
        if (nextAppState.match(/inactive|background/)) {
            console.log('DetailsController: App paused, pausing subscription');
            this.isPaused = true;
            this._stopObserving();
        } else if (nextAppState === 'active') {
            console.log('DetailsController: App resumed, resuming subscription');
            this.isPaused = false;

            if (this.activeItemId) {
                this._startObserving(this.activeItemId);
            }
        }
    }

    private _startObserving(id: string) {
        this._stopObserving();

        const args = new ObserveViewCountUseCase.Args(id);
        this.countSubscription = this.observeViewCountUseCase.execute(args).subscribe({
            next: (model) => {
                if (!this.isPaused) {
                    this._setState({ viewCount: model.count });
                }
            },
            error: (err) => console.error('ViewCount Error:', err),
        });
    }

    private _stopObserving() {
        if (this.countSubscription) {
            this.countSubscription.unsubscribe();
            this.countSubscription = null;
        }
    }

    async getItemDetails(id: string): Promise<ItemDetailPresentationModel | null> {
        this.activeItemId = id;

        if (!this.isPaused) {
            this._startObserving(id);
        }

        if (this.state.detailsCache.has(id)) {
            const detail = this.state.detailsCache.get(id)!;
            this._setState({ detail, isLoading: false, error: null });
            return detail;
        }

        this._setState({ isLoading: true, error: null, viewCount: 0 });

        try {
            const args = new GetItemDetailUseCase.Args(id);
            const result = await this.getItemDetailUseCase.execute(args);

            if (result.isSuccess) {
                const detail = result.getValue();
                this._setState((state) => {
                    const newCache = new Map(state.detailsCache);
                    newCache.set(id, detail);
                    return {
                        detailsCache: newCache,
                        detail,
                        isLoading: false,
                    };
                });
                return detail;
            } else {
                throw result.error;
            }

        } catch (error: any) {
            console.error('Failed to get item details:', error);
            this._setState({
                isLoading: false,
                error: error.message,
            });
            throw error;
        }
    }

    reset() {
        this._stopObserving();
        this.activeItemId = null;
        this._setState({ detail: null, viewCount: 0, error: null });
    }

    clearError() {
        this._setState({ error: null });
    }
}
