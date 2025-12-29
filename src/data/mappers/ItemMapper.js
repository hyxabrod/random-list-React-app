import { ListItem } from '../../domain/entities/ListItem';
import { ItemDetail } from '../../domain/entities/ItemDetail';

export class ItemMapper {

    static toListItem(dto) {
        if (!dto) {
            throw new Error('Cannot map null or undefined to ListItem');
        }

        return new ListItem(dto.id, dto.title);
    }

    static toListItems(dtos) {
        if (!Array.isArray(dtos)) {
            return [];
        }

        return dtos.map(dto => this.toListItem(dto));
    }

    static toItemDetail(dto) {
        if (!dto) {
            throw new Error('Cannot map null or undefined to ItemDetail');
        }

        return new ItemDetail(
            dto.id,
            dto.title,
            dto.text,
            dto.metadata
        );
    }
}
