import { create } from 'zustand';
import { getContainer } from '../../di/inversify.config';
import { TYPES } from '../../di/types';

const container = getContainer();
const controller = container.get(TYPES.ListStoreController);

const useListStore = create((set, get) => {

    const unsubscribe = controller.subscribe((newState) => {
        set(newState);
    });

    return {

        ...controller.getState(),

        initialize: () => controller.initialize(),
        loadMoreItems: () => controller.loadMoreItems(),
        refreshItems: () => controller.refreshItems(),
        clearError: () => controller.clearError(),

        getItems: () => controller.getItems(),
        getError: () => controller.getError(),

        dispose: () => unsubscribe(),
    };
});

export default useListStore;
