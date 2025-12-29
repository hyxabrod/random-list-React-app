
import 'reflect-metadata';
import { ListStoreController } from '../ListStoreController';
import { Result } from '../../../core/Result';

const mockGetListItemsUseCase = {
    execute: jest.fn(),
};

const mockRefreshItemsUseCase = {
    execute: jest.fn(),
};

const mockAppState = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

describe('ListStoreController', () => {
    let controller;
    let mockAppStateSubscription;

    beforeEach(() => {
        jest.clearAllMocks();
        mockAppStateSubscription = { remove: jest.fn() };
        mockAppState.addEventListener.mockReturnValue(mockAppStateSubscription);

        controller = new ListStoreController(
            mockGetListItemsUseCase,
            mockRefreshItemsUseCase,
            mockAppState
        );
    });

    it('should have initial state', () => {
        expect(controller.getState()).toEqual({
            items: [],
            currentPage: 0,
            isLoadingMore: false,
            isRefreshing: false,
            error: null,
        });
    });

    it('should initialize successfully', async () => {
        const mockItems = [{ id: '1', title: 'Item 1' }];
        mockGetListItemsUseCase.execute.mockResolvedValue(Result.success(mockItems));

        await controller.initialize();

        expect(mockGetListItemsUseCase.execute).toHaveBeenCalledWith({ page: 0, pageSize: 20 });
        expect(controller.getState().items).toEqual(mockItems);
        expect(controller.getState().error).toBeNull();
    });

    it('should handle initialization error', async () => {
        const error = new Error('Network error');
        mockGetListItemsUseCase.execute.mockResolvedValue(Result.failure(error));

        await controller.initialize();

        expect(controller.getState().error).toBe('Network error');
    });

    it('should load more items successfully', async () => {
        const initialItems = [{ id: '1' }];
        controller._setState({ items: initialItems, currentPage: 0 });

        const newItems = [{ id: '2' }];
        mockGetListItemsUseCase.execute.mockResolvedValue(Result.success(newItems));

        await controller.loadMoreItems();

        expect(mockGetListItemsUseCase.execute).toHaveBeenCalledWith({ page: 1, pageSize: 20 });
        expect(controller.getState().items).toEqual([...initialItems, ...newItems]);
        expect(controller.getState().currentPage).toBe(1);
        expect(controller.getState().isLoadingMore).toBe(false);
    });

    it('should prevent multiple load more calls', async () => {
        controller._setState({ isLoadingMore: true });

        await controller.loadMoreItems();

        expect(mockGetListItemsUseCase.execute).not.toHaveBeenCalled();
    });

    it('should refresh items successfully', async () => {
        const refreshedItems = [{ id: '3' }];
        mockGetListItemsUseCase.execute.mockResolvedValue(Result.success(refreshedItems));
        mockRefreshItemsUseCase.execute.mockResolvedValue(Result.success());

        await controller.refreshItems();

        expect(mockRefreshItemsUseCase.execute).toHaveBeenCalled();
        expect(mockGetListItemsUseCase.execute).toHaveBeenCalledWith({ page: 0, pageSize: 20 });
        expect(controller.getState().items).toEqual(refreshedItems);
        expect(controller.getState().isRefreshing).toBe(false);
    });

    it('should notify listeners on state change', () => {
        const listener = jest.fn();
        controller.subscribe(listener);

        controller._setState({ items: [] });

        expect(listener).toHaveBeenCalledWith(controller.getState());
    });
});
