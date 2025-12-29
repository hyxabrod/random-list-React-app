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

import { AppState } from 'react-native';

let containerInstance = null;

export function getContainer() {
    if (containerInstance) {
        return containerInstance;
    }

    const container = new Container();

    container.bind(TYPES.AppState).toConstantValue(AppState);

    container.bind(TYPES.ItemDataSource).toDynamicValue(() => {
        return new MockItemDataSource();
    }).inSingletonScope();

    container.bind(TYPES.ItemRepository).toDynamicValue((context) => {
        return new ItemRepositoryImpl(
            context.get(TYPES.ItemDataSource)
        );
    }).inSingletonScope();

    container.bind(TYPES.ViewCountRepository).to(ViewCountRepositoryImpl).inSingletonScope();

    container.bind(TYPES.GetListItemsUseCase).toDynamicValue((context) => {
        return new GetListItemsUseCase(
            context.get(TYPES.ItemRepository)
        );
    }).inTransientScope();

    container.bind(TYPES.GetItemDetailUseCase).toDynamicValue((context) => {
        return new GetItemDetailUseCase(
            context.get(TYPES.ItemRepository)
        );
    }).inTransientScope();

    container.bind(TYPES.RefreshItemsUseCase).toDynamicValue((context) => {
        return new RefreshItemsUseCase(
            context.get(TYPES.ItemRepository)
        );
    }).inTransientScope();

    container.bind(TYPES.ObserveViewCountUseCase).toDynamicValue((context) => {
        return new ObserveViewCountUseCase(
            context.get(TYPES.ViewCountRepository)
        );
    }).inTransientScope();

    container.bind(TYPES.ListStoreController).toDynamicValue((context) => {
        return new ListStoreController(
            context.get(TYPES.GetListItemsUseCase),
            context.get(TYPES.RefreshItemsUseCase),
            context.get(TYPES.AppState)
        );
    }).inSingletonScope();

    container.bind(TYPES.DetailsStoreController).toDynamicValue((context) => {
        return new DetailsStoreController(
            context.get(TYPES.GetItemDetailUseCase),
            context.get(TYPES.ObserveViewCountUseCase),
            context.get(TYPES.AppState)
        );
    }).inSingletonScope();

    containerInstance = container;
    return container;
}
