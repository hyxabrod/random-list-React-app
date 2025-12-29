import { create } from 'zustand';
import { getContainer } from '../../core/inversify.config';
import { TYPES } from '../../core/types';

const container = getContainer();

const controller = container.get(TYPES.DetailsStoreController);

const useDetailsStore = create((set, get) => {

    controller.subscribe((newState) => {
        set(newState);
    });

    return {

        ...controller.getState(),

        getItemDetails: (id) => controller.getItemDetails(id),
        reset: () => controller.reset(),
        clearError: () => controller.clearError(),

        getDetail: () => controller.getState().detail,
        getViewCount: () => controller.getState().viewCount,
        isLoading: () => controller.getState().isLoading,
        getError: () => controller.getState().error,
    };
});

export default useDetailsStore;
