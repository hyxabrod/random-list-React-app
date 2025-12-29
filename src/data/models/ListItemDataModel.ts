
import { DataModel } from '../../core/DataModel';
import { ListItem } from '../../domain/entities/ListItem';

export class ListItemDataModel extends DataModel {
    public id: string;
    public title: string;

    constructor(data: any) {
        super();
        this.id = data.id;
        this.title = data.title;
    }

    toDomainModel(): ListItem {
        if (!this.id || !this.title) {
            console.warn('Invalid ListItemDataModel:', this);
        }
        return new ListItem(this.id, this.title);
    }
}
