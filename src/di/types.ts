
export const TYPES = {
    ItemDataSource: Symbol.for('ItemDataSource'),

    ItemRepository: Symbol.for('ItemRepository'),
    ViewCountRepository: Symbol.for('ViewCountRepository'),

    GetListItemsUseCase: Symbol.for('GetListItemsUseCase'),
    GetItemDetailUseCase: Symbol.for('GetItemDetailUseCase'),
    ObserveViewCountUseCase: Symbol.for('ObserveViewCountUseCase'),
    GetViewCountUseCase: Symbol.for('GetViewCountUseCase'),
    RefreshItemsUseCase: Symbol.for('RefreshItemsUseCase'),

    ListStoreController: Symbol.for('ListStoreController'),
    DetailsStoreController: Symbol.for('DetailsStoreController'),

    AppState: Symbol.for('AppState'),
};
