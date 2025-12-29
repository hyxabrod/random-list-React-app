
import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

import { MockItemDataSource } from '../data/datasources/MockItemDataSource';
import { ItemRepositoryImpl } from '../data/repositories/ItemRepositoryImpl';
import { ViewCountRepositoryImpl } from '../data/repositories/ViewCountRepositoryImpl';

import { GetListItemsUseCase } from '../domain/usecases/GetListItemsUseCase';
import { GetItemDetailUseCase } from '../domain/usecases/GetItemDetailUseCase';
import { RefreshItemsUseCase } from '../domain/usecases/RefreshItemsUseCase';
import { ObserveViewCountUseCase } from '../domain/usecases/ObserveViewCountUseCase';

import { ListStoreController } from '../presentation/controllers/ListStoreController';
import { DetailsStoreController } from '../presentation/controllers/DetailsStoreController';

import { AppState, AppStateStatic } from 'react-native';

let containerInstance: Container | null = null;

export function getContainer(): Container {
    if (containerInstance) {
        return containerInstance;
    }

    const container = new Container();

    container.bind<AppStateStatic>(TYPES.AppState).toConstantValue(AppState);

    container.bind<MockItemDataSource>(TYPES.ItemDataSource).toDynamicValue(() => {
        return new MockItemDataSource();
    }).inSingletonScope();

    container.bind<ItemRepositoryImpl>(TYPES.ItemRepository).toDynamicValue(() => {
        return new ItemRepositoryImpl(
            container.get(TYPES.ItemDataSource)
        );
    }).inSingletonScope();

    container.bind<ViewCountRepositoryImpl>(TYPES.ViewCountRepository).to(ViewCountRepositoryImpl).inSingletonScope();

    container.bind<GetListItemsUseCase>(TYPES.GetListItemsUseCase).toDynamicValue(() => {
        return new GetListItemsUseCase(
            container.get(TYPES.ItemRepository)
        );
    }).inTransientScope();

    container.bind<GetItemDetailUseCase>(TYPES.GetItemDetailUseCase).toDynamicValue(() => {
        return new GetItemDetailUseCase(
            container.get(TYPES.ItemRepository)
        );
    }).inTransientScope();

    container.bind<RefreshItemsUseCase>(TYPES.RefreshItemsUseCase).toDynamicValue(() => {
        return new RefreshItemsUseCase(
            container.get(TYPES.ItemRepository)
        );
    }).inTransientScope();

    container.bind<ObserveViewCountUseCase>(TYPES.ObserveViewCountUseCase).toDynamicValue(() => {
        return new ObserveViewCountUseCase(
            container.get(TYPES.ViewCountRepository)
        );
    }).inTransientScope();

    container.bind<ListStoreController>(TYPES.ListStoreController).toDynamicValue(() => {
        return new ListStoreController(
            container.get(TYPES.GetListItemsUseCase),
            container.get(TYPES.RefreshItemsUseCase),
            container.get(TYPES.AppState)
        );
    }).inSingletonScope();

    container.bind<DetailsStoreController>(TYPES.DetailsStoreController).toDynamicValue(() => {
        return new DetailsStoreController(
            container.get(TYPES.GetItemDetailUseCase),
            container.get(TYPES.ObserveViewCountUseCase),
            container.get(TYPES.AppState)
        );
    }).inSingletonScope();

    containerInstance = container;
    return container;
}
