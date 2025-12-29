
import { create } from 'zustand';
import { getContainer } from '../../di/inversify.config';
import { TYPES } from '../../di/types';
import { DetailsStoreController, DetailsState } from '../controllers/DetailsStoreController';
import { ItemDetailPresentationModel } from '../models/ItemDetailPresentationModel';

const container = getContainer();

const controller = container.get<DetailsStoreController>(TYPES.DetailsStoreController);

interface DetailsStore extends DetailsState {
    getItemDetails: (id: string) => Promise<ItemDetailPresentationModel | null>;
    reset: () => void;
    clearError: () => void;
}

const useDetailsStore = create<DetailsStore>((set, get) => {

    controller.subscribe((newState) => {
        set(newState);
    });

    return {
        ...controller.getState(),

        getItemDetails: (id: string) => controller.getItemDetails(id),
        reset: () => controller.reset(),
        clearError: () => controller.clearError(),
    };
});

export default useDetailsStore;
