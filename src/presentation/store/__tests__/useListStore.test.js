import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { getContainer } from '../../../core/inversify.config';
import { TYPES } from '../../../core/types';

jest.mock('../../../core/inversify.config', () => ({
    getContainer: jest.fn(),
}));

describe('useListStore', () => {
    let mockController;
    let mockContainer;
    let useListStore;

    beforeEach(() => {
        jest.clearAllMocks();

        mockController = {
            subscribe: jest.fn((callback) => {
                return jest.fn();
            }),
            getState: jest.fn(() => ({ items: [], currentPage: 0, error: null })),
            initialize: jest.fn(),
            loadMoreItems: jest.fn(),
            refreshItems: jest.fn(),
            clearError: jest.fn(),
            getItems: jest.fn().mockReturnValue([]),
            getError: jest.fn().mockReturnValue(null),
        };

        mockContainer = {
            get: jest.fn().mockReturnValue(mockController),
        };
        getContainer.mockReturnValue(mockContainer);

        jest.isolateModules(() => {

            jest.doMock('react', () => React);
            useListStore = require('../useListStore').default;
        });
    });

    it('should initialize with state from controller', () => {
        const { result } = renderHook(() => useListStore());

        expect(result.current.items).toEqual([]);
        expect(result.current.currentPage).toBe(0);
    });

    it('should resolve dependencies correctly', () => {
        renderHook(() => useListStore());
        expect(mockContainer.get).toHaveBeenCalledWith(TYPES.ListStoreController);
    });

    it('should call controller initialize', () => {
        const { result } = renderHook(() => useListStore());

        act(() => {
            result.current.initialize();
        });
        expect(mockController.initialize).toHaveBeenCalled();
    });

    it('should call controller loadMoreItems', () => {
        const { result } = renderHook(() => useListStore());

        act(() => {
            result.current.loadMoreItems();
        });
        expect(mockController.loadMoreItems).toHaveBeenCalled();
    });

    it('should call controller refreshItems', () => {
        const { result } = renderHook(() => useListStore());

        act(() => {
            result.current.refreshItems();
        });
        expect(mockController.refreshItems).toHaveBeenCalled();
    });
});
