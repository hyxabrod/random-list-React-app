
import { ListItem } from '../entities/ListItem';
import { ItemDetail } from '../entities/ItemDetail';
import { Result } from '../../core/Result';

export interface IItemRepository {
    getItems(page: number, pageSize: number): Promise<Result<ListItem[]>>;
    getItemDetail(id: string): Promise<Result<ItemDetail>>;
    refreshItems(): Promise<Result<void>>;
}
