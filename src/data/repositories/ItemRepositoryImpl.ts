
import { IItemRepository } from '../../domain/repositories/IItemRepository';
import { ListItemDataModel } from '../models/ListItemDataModel';
import { ItemDetailDataModel } from '../models/ItemDetailDataModel';
import { ListItem } from '../../domain/entities/ListItem';
import { ItemDetail } from '../../domain/entities/ItemDetail';
import { Result } from '../../core/Result';
import { MockItemDataSource } from '../datasources/MockItemDataSource';

export class ItemRepositoryImpl implements IItemRepository {
    private dataSource: MockItemDataSource;

    constructor(dataSource: MockItemDataSource) {
        this.dataSource = dataSource;
    }

    async getItems(page: number, pageSize: number): Promise<Result<ListItem[]>> {
        try {
            const rawItems = await this.dataSource.fetchItems(page, pageSize);

            if (!Array.isArray(rawItems)) {
                return Result.success([]);
            }

            const items = rawItems
                .map(itemData => new ListItemDataModel(itemData))
                .map(dataModel => dataModel.toDomainModel());

            return Result.success(items);

        } catch (error: any) {
            console.error('Error fetching items:', error);
            return Result.failure(new Error('Failed to fetch items from repository'));
        }
    }

    async getItemDetail(id: string): Promise<Result<ItemDetail>> {
        try {
            const rawDetail = await this.dataSource.fetchItemDetail(id);
            if (!rawDetail) {
                return Result.failure(new Error(`Item detail not found for id: ${id}`));
            }

            const dataModel = new ItemDetailDataModel(rawDetail);
            return Result.success(dataModel.toDomainModel());

        } catch (error: any) {
            console.error('Error fetching item detail:', error);
            return Result.failure(new Error(`Failed to fetch detail for item ${id}`));
        }
    }

    async refreshItems(): Promise<Result<void>> {
        try {
            await this.dataSource.clearCache();
            return Result.success(undefined);
        } catch (error: any) {
            console.error('Error refreshing items:', error);
            return Result.failure(new Error('Failed to refresh items'));
        }
    }
}
