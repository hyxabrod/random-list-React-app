
import { AppStateStatic, AppStateStatus } from 'react-native';
import { GetListItemsUseCase, GetListItemsArgs } from '../../domain/usecases/GetListItemsUseCase';
import { RefreshItemsUseCase } from '../../domain/usecases/RefreshItemsUseCase';
import { ListItemPresentationModel } from '../../presentation/models/ListItemPresentationModel';

export interface ListState {
    items: ListItemPresentationModel[];
    currentPage: number;
    isLoadingMore: boolean;
    isRefreshing: boolean;
    error: string | null;
}

export class ListStoreController {

    private state: ListState;
    private listeners: Set<(state: ListState) => void>;
    private isPaused: boolean;
    private appStateSubscription: any;

    constructor(
        private getListItemsUseCase: GetListItemsUseCase,
        private refreshItemsUseCase: RefreshItemsUseCase,
        private appState: AppStateStatic
    ) {
        this.state = {
            items: [],
            currentPage: 0,
            isLoadingMore: false,
            isRefreshing: false,
            error: null,
        };

        this.listeners = new Set();
        this.isPaused = false;
        this.appStateSubscription = this.appState.addEventListener('change', this._handleAppStateChange.bind(this));
    }

    private _handleAppStateChange(nextAppState: AppStateStatus) {
        if (nextAppState.match(/inactive|background/)) {
            console.log('Controller: App paused');
            this.isPaused = true;
        } else if (nextAppState === 'active') {
            console.log('Controller: App resumed');
            this.isPaused = false;
            this._notifyListeners();
        }
    }

    getState(): ListState {
        return this.state;
    }

    subscribe(listener: (state: ListState) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private _setState(updater: Partial<ListState> | ((prevState: ListState) => Partial<ListState>)) {
        const newState = typeof updater === 'function'
            ? updater(this.state)
            : updater;

        this.state = { ...this.state, ...newState };
        this._notifyListeners();
    }

    private _notifyListeners() {
        if (!this.isPaused) {
            this.listeners.forEach(listener => listener(this.state));
        }
    }

    async initialize() {
        try {
            const args = new GetListItemsUseCase.Args(0, 20);
            const result = await this.getListItemsUseCase.execute(args);

            if (result.isSuccess) {
                this._setState({
                    items: result.getValue(),
                    currentPage: 0,
                    error: null,
                });
            } else {
                throw result.error;
            }
        } catch (error: any) {
            console.error('Failed to initialize:', error);
            this._setState({ error: error.message });
        }
    }

    async loadMoreItems() {
        if (this.state.isLoadingMore) return;

        this._setState({ isLoadingMore: true, error: null });

        try {
            const args = new GetListItemsUseCase.Args(this.state.currentPage + 1, 20);
            const result = await this.getListItemsUseCase.execute(args);

            if (result.isSuccess) {
                const newItems = result.getValue();
                this._setState((state) => ({
                    items: [...state.items, ...newItems],
                    currentPage: state.currentPage + 1,
                    isLoadingMore: false,
                }));
            } else {
                throw result.error;
            }
        } catch (error: any) {
            console.error('Failed to load more:', error);
            this._setState({
                isLoadingMore: false,
                error: error.message,
            });
        }
    }

    async refreshItems() {
        if (this.state.isRefreshing) return;

        this._setState({ isRefreshing: true, error: null });

        try {
            const refreshResult = await this.refreshItemsUseCase.execute();
            if (refreshResult.isFailure) {
                throw refreshResult.error;
            }

            const args = new GetListItemsUseCase.Args(0, 20);
            const listResult = await this.getListItemsUseCase.execute(args);

            if (listResult.isSuccess) {
                this._setState({
                    items: listResult.getValue(),
                    currentPage: 0,
                    isRefreshing: false,
                });
            } else {
                throw listResult.error;
            }
        } catch (error: any) {
            console.error('Failed to refresh:', error);
            this._setState({
                isRefreshing: false,
                error: error.message,
            });
        }
    }

    clearError() {
        this._setState({ error: null });
    }

    getItems() {
        return this.state.items;
    }

    isLoading() {
        return this.state.isLoadingMore;
    }

    isRefreshingList() {
        return this.state.isRefreshing;
    }

    getError() {
        return this.state.error;
    }
}
