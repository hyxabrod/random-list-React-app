import { IItemRepository } from '../../domain/repositories/IItemRepository';
import { ItemMapper } from '../mappers/ItemMapper';

export class ItemRepositoryImpl extends IItemRepository {

    constructor(dataSource) {
        super();
        this.dataSource = dataSource;
    }

    async getItems(page, pageSize) {
        try {

            const dtos = await this.dataSource.fetchItems(page, pageSize);

            return ItemMapper.toListItems(dtos);
        } catch (error) {
            console.error('Error fetching items:', error);
            throw new Error('Failed to fetch items from repository');
        }
    }

    async getItemDetail(id) {
        try {

            const dto = await this.dataSource.fetchItemDetail(id);

            return ItemMapper.toItemDetail(dto);
        } catch (error) {
            console.error('Error fetching item detail:', error);
            throw new Error(`Failed to fetch detail for item ${id}`);
        }
    }

    async refreshItems() {
        try {
            await this.dataSource.clearCache();
        } catch (error) {
            console.error('Error refreshing items:', error);
            throw new Error('Failed to refresh items');
        }
    }
}
