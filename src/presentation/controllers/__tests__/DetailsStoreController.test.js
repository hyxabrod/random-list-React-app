
import 'reflect-metadata';
import { DetailsStoreController } from '../DetailsStoreController';
import { Result } from '../../../core/Result';
import { Subject } from 'rxjs';

const mockGetItemDetailUseCase = {
    execute: jest.fn(),
};

const mockObserveViewCountUseCase = {
    execute: jest.fn(),
};

const mockAppState = {
    addEventListener: jest.fn(),
};

describe('DetailsStoreController', () => {
    let controller;
    let mockAppStateSubscription;
    let viewCountSubject;

    beforeEach(() => {
        jest.clearAllMocks();
        mockAppStateSubscription = { remove: jest.fn() };
        mockAppState.addEventListener.mockReturnValue(mockAppStateSubscription);

        viewCountSubject = new Subject();
        mockObserveViewCountUseCase.execute.mockReturnValue(viewCountSubject);

        controller = new DetailsStoreController(
            mockGetItemDetailUseCase,
            mockObserveViewCountUseCase,
            mockAppState
        );
    });

    it('should have initial state', () => {
        expect(controller.getState()).toEqual({
            detailsCache: expect.any(Map),
            detail: null,
            viewCount: 0,
            isLoading: false,
            error: null,
        });
    });

    it('should get item details successfully', async () => {
        const mockDetail = { id: '1', title: 'Details' };
        mockGetItemDetailUseCase.execute.mockResolvedValue(Result.success(mockDetail));

        const promise = controller.getItemDetails('1');

        expect(controller.getState().isLoading).toBe(true);
        expect(controller.getState().error).toBeNull();

        await promise;

        expect(mockGetItemDetailUseCase.execute).toHaveBeenCalledWith({ id: '1' });
        expect(controller.getState().detail).toEqual(mockDetail);
        expect(controller.getState().isLoading).toBe(false);
        expect(controller.getState().detailsCache.get('1')).toEqual(mockDetail);
    });

    it('should check cache before fetching', async () => {
        const mockDetail = { id: '1', title: 'Cached' };
        controller._setState((state) => {
            const newCache = new Map(state.detailsCache);
            newCache.set('1', mockDetail);
            return { detailsCache: newCache };
        });

        await controller.getItemDetails('1');

        expect(mockGetItemDetailUseCase.execute).not.toHaveBeenCalled();
        expect(controller.getState().detail).toEqual(mockDetail);
    });

    it('should handle errors when fetching details', async () => {
        const error = new Error('Fetch failed');
        mockGetItemDetailUseCase.execute.mockResolvedValue(Result.failure(error));

        await expect(controller.getItemDetails('1')).rejects.toThrow('Fetch failed');

        expect(controller.getState().isLoading).toBe(false);
        expect(controller.getState().error).toBe('Fetch failed');
    });

    it('should observe view count when getting details', async () => {
        const mockDetail = { id: '1', title: 'Details' };
        mockGetItemDetailUseCase.execute.mockResolvedValue(Result.success(mockDetail));

        await controller.getItemDetails('1');

        expect(mockObserveViewCountUseCase.execute).toHaveBeenCalledWith('1');

        viewCountSubject.next(42);
        expect(controller.getState().viewCount).toBe(42);
    });

    it('should stop and start observing on app state change', async () => {
        const mockDetail = { id: '1', title: 'Details' };
        mockGetItemDetailUseCase.execute.mockResolvedValue(Result.success(mockDetail));
        await controller.getItemDetails('1');

        const handler = mockAppState.addEventListener.mock.calls[0][1];

        handler('background');
        expect(controller.isPaused).toBe(true);

        viewCountSubject.next(100);
        expect(controller.getState().viewCount).not.toBe(100);

        handler('active');
        expect(controller.isPaused).toBe(false);

        expect(mockObserveViewCountUseCase.execute).toHaveBeenCalledTimes(2);
    });

    it('should reset state', () => {
        controller.reset();
        expect(controller.getState().detail).toBeNull();
        expect(controller.getState().viewCount).toBe(0);
        expect(controller.getState().error).toBeNull();
    });
});
