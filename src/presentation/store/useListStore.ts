
import { create } from 'zustand';
import { getContainer } from '../../di/inversify.config';
import { TYPES } from '../../di/types';
import { ListStoreController, ListState } from '../controllers/ListStoreController';
import { ListItemPresentationModel } from '../models/ListItemPresentationModel';

const container = getContainer();
const controller = container.get<ListStoreController>(TYPES.ListStoreController);

interface ListStore extends ListState {
    initialize: () => Promise<void>;
    loadMoreItems: () => Promise<void>;
    refreshItems: () => Promise<void>;
    clearError: () => void;
    dispose: () => void;
}

const useListStore = create<ListStore>((set, get) => {

    const unsubscribe = controller.subscribe((newState) => {
        set(newState);
    });

    return {
        ...controller.getState(),

        initialize: () => controller.initialize(),
        loadMoreItems: () => controller.loadMoreItems(),
        refreshItems: () => controller.refreshItems(),
        clearError: () => controller.clearError(),

        dispose: () => unsubscribe(),
    };
});

export default useListStore;
