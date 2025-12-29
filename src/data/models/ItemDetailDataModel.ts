
import { DataModel } from '../../core/DataModel';
import { ItemDetail } from '../../domain/entities/ItemDetail';

export class ItemDetailDataModel extends DataModel {
    public id: string;
    public title: string;
    public text: string;


    constructor(data: any) {
        super();
        this.id = data.id;
        this.title = data.title;
        this.text = data.text;
    }

    toDomainModel(): ItemDetail {
        return new ItemDetail(
            this.id,
            this.title,
            this.text,
            ''
        );
    }
}
