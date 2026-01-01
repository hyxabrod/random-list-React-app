
import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { getContainer } from '../../../di/inversify.config';
import { TYPES } from '../../../di/types';

jest.mock('../../../di/inversify.config', () => ({
    getContainer: jest.fn(),
}));

describe('useDetailsStore', () => {
    let mockController: any;
    let mockContainer: any;
    let useDetailsStore: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockController = {
            subscribe: jest.fn((callback) => {
                return jest.fn();
            }),
            getState: jest.fn(() => ({
                detail: null,
                viewCount: 0,
                isLoading: false,
                error: null
            })),
            getItemDetails: jest.fn(),
            reset: jest.fn(),
            clearError: jest.fn(),
        };

        mockContainer = {
            get: jest.fn().mockReturnValue(mockController),
        };
        (getContainer as jest.Mock).mockReturnValue(mockContainer);

        jest.isolateModules(() => {
            jest.doMock('react', () => React);
            useDetailsStore = require('../useDetailsStore').default;
        });
    });

    it('should initialize with state from controller', () => {
        const { result } = renderHook(() => useDetailsStore());

        expect(result.current.detail).toBeNull();
        expect(result.current.viewCount).toBe(0);
    });

    it('should resolve dependencies correctly', () => {
        renderHook(() => useDetailsStore());
        expect(mockContainer.get).toHaveBeenCalledWith(TYPES.DetailsStoreController);
    });

    it('should call controller getItemDetails', () => {
        const { result } = renderHook(() => useDetailsStore());

        act(() => {
            result.current.getItemDetails('123');
        });
        expect(mockController.getItemDetails).toHaveBeenCalledWith('123', undefined);
    });

    it('should call controller reset', () => {
        const { result } = renderHook(() => useDetailsStore());

        act(() => {
            result.current.reset();
        });
        expect(mockController.reset).toHaveBeenCalled();
    });

    it('should call controller clearError', () => {
        const { result } = renderHook(() => useDetailsStore());

        act(() => {
            result.current.clearError();
        });
        expect(mockController.clearError).toHaveBeenCalled();
    });
});
