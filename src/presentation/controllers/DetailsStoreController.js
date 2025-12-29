
import { GetItemDetailUseCase } from '../../domain/usecases/GetItemDetailUseCase';

export class DetailsStoreController {

    constructor(getItemDetailUseCase, observeViewCountUseCase, appState) {
        this.getItemDetailUseCase = getItemDetailUseCase;
        this.observeViewCountUseCase = observeViewCountUseCase;
        this.appState = appState;

        this.countSubscription = null;
        this.activeItemId = null;

        this.isPaused = false;
        this.appStateSubscription = this.appState.addEventListener('change', this._handleAppStateChange.bind(this));

        this.state = {
            detailsCache: new Map(),
            detail: null,
            viewCount: 0,
            isLoading: false,
            error: null,
        };

        this.listeners = new Set();
    }

    getState() {
        return this.state;
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    _setState(updater) {
        const newState = typeof updater === 'function'
            ? updater(this.state)
            : updater;

        this.state = { ...this.state, ...newState };
        this._notifyListeners();
    }

    _notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }

    _handleAppStateChange(nextAppState) {
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

    _startObserving(id) {
        this._stopObserving();

        this.countSubscription = this.observeViewCountUseCase.execute(id).subscribe({
            next: (count) => {
                if (!this.isPaused) {
                    this._setState({ viewCount: count });
                }
            },
            error: (err) => console.error('ViewCount Error:', err),
        });
    }

    _stopObserving() {
        if (this.countSubscription) {
            this.countSubscription.unsubscribe();
            this.countSubscription = null;
        }
    }

    async getItemDetails(id) {
        this.activeItemId = id;

        if (!this.isPaused) {
            this._startObserving(id);
        }

        if (this.state.detailsCache.has(id)) {
            const detail = this.state.detailsCache.get(id);
            this._setState({ detail, isLoading: false, error: null });
            return detail;
        }

        this._setState({ isLoading: true, error: null, viewCount: 0 });

        try {
            const args = new GetItemDetailUseCase.Args(id);
            const result = await this.getItemDetailUseCase.execute(args);

            if (result.isSuccess) {
                const detail = result.getValue();
                this._setState(state => {
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

        } catch (error) {
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
