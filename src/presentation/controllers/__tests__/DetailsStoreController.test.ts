
import 'reflect-metadata';
import { DetailsStoreController } from '../DetailsStoreController';
import { Result } from '../../../core/Result';
import { Subject } from 'rxjs';
import { AppStateStatic } from 'react-native';
import { ViewCountPresentationModel } from '../../models/ViewCountPresentationModel';

const mockGetItemDetailUseCase = {
    execute: jest.fn(),
} as any;

const mockObserveViewCountUseCase = {
    execute: jest.fn(),
} as any;

const mockGetViewCountUseCase = {
    execute: jest.fn(),
} as any;

const mockAppState = {
    addEventListener: jest.fn(),
} as unknown as AppStateStatic;

describe('DetailsStoreController', () => {
    let controller: DetailsStoreController;
    let mockAppStateSubscription: { remove: jest.Mock };
    let viewCountSubject: Subject<any>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockAppStateSubscription = { remove: jest.fn() };
        (mockAppState.addEventListener as jest.Mock).mockReturnValue(mockAppStateSubscription);

        viewCountSubject = new Subject();
        mockObserveViewCountUseCase.execute.mockReturnValue(viewCountSubject);
        mockGetViewCountUseCase.execute.mockReturnValue(Result.success(new ViewCountPresentationModel(0)));

        controller = new DetailsStoreController(
            mockGetItemDetailUseCase,
            mockObserveViewCountUseCase,
            mockGetViewCountUseCase,
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

    it('should use stored view count if available', async () => {
        const storedCount = 100;
        mockGetViewCountUseCase.execute.mockReturnValue(Result.success(new ViewCountPresentationModel(storedCount)));
        mockGetItemDetailUseCase.execute.mockResolvedValue(Result.success({ id: '1', title: 'Details' }));

        await controller.getItemDetails('1', 0);

        expect(controller.getState().viewCount).toBe(storedCount);
    });

    it('should call GetViewCountUseCase using stored count', async () => {
        const storedCount = 100;
        mockGetViewCountUseCase.execute.mockReturnValue(Result.success(new ViewCountPresentationModel(storedCount)));
        mockGetItemDetailUseCase.execute.mockResolvedValue(Result.success({ id: '1', title: 'Details' }));

        await controller.getItemDetails('1', 0);

        expect(mockGetViewCountUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
    });

    it('should use passed initial view count if no stored count', async () => {
        mockGetViewCountUseCase.execute.mockReturnValue(Result.success(new ViewCountPresentationModel(0)));
        mockGetItemDetailUseCase.execute.mockResolvedValue(Result.success({ id: '1', title: 'Details' }));

        await controller.getItemDetails('1', 50);

        expect(controller.getState().viewCount).toBe(50);
    });

    it('should get item details successfully', async () => {
        const mockDetail = { id: '1', title: 'Details' } as any;
        mockGetItemDetailUseCase.execute.mockResolvedValue(Result.success(mockDetail));

        const promise = controller.getItemDetails('1');

        expect(controller.getState().isLoading).toBe(true);
        expect(controller.getState().error).toBeNull();

        await promise;

        expect(controller.getState().detail).toEqual(mockDetail);
        expect(controller.getState().isLoading).toBe(false);
        expect(controller.getState().detailsCache.get('1')).toEqual(mockDetail);
    });

    it('should check cache before fetching', async () => {
        const mockDetail = { id: '1', title: 'Cached' } as any;
        (controller as any)._setState((state: any) => {
            const newCache = new Map(state.detailsCache);
            newCache.set('1', mockDetail);
            return { detailsCache: newCache };
        });

        await controller.getItemDetails('1');

        expect(controller.getState().detail).toEqual(mockDetail);
    });

    it('should not call fetching use case if item is in cache', async () => {
        const mockDetail = { id: '1', title: 'Cached' } as any;
        (controller as any)._setState((state: any) => {
            const newCache = new Map(state.detailsCache);
            newCache.set('1', mockDetail);
            return { detailsCache: newCache };
        });

        await controller.getItemDetails('1');

        expect(mockGetItemDetailUseCase.execute).not.toHaveBeenCalled();
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

        viewCountSubject.next({ count: 42 });
        expect(controller.getState().viewCount).toBe(42);
    });

    it('should call ObserveViewCountUseCase correctly', async () => {
        const mockDetail = { id: '1', title: 'Details' };
        mockGetItemDetailUseCase.execute.mockResolvedValue(Result.success(mockDetail));

        await controller.getItemDetails('1');

        expect(mockObserveViewCountUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
    });

    it('should stop and start observing on app state change', async () => {
        const mockDetail = { id: '1', title: 'Details' };
        mockGetItemDetailUseCase.execute.mockResolvedValue(Result.success(mockDetail));
        await controller.getItemDetails('1');

        const handler = (mockAppState.addEventListener as jest.Mock).mock.calls[0][1];

        handler('background');

        viewCountSubject.next(100);
        expect(controller.getState().viewCount).not.toBe(100);

        handler('active');
        expect(mockObserveViewCountUseCase.execute).toHaveBeenCalledTimes(2);
    });

    it('should reset state', () => {
        controller.reset();
        expect(controller.getState().detail).toBeNull();
        expect(controller.getState().viewCount).toBe(0);
        expect(controller.getState().error).toBeNull();
    });
});
