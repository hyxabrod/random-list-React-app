
import { DomainModel } from '../../core/DomainModel';
import { ItemDetailPresentationModel } from '../../presentation/models/ItemDetailPresentationModel';

export class ItemDetail extends DomainModel {
    constructor(
        public id: string,
        public title: string,
        public text: string,
        public imageUrl: string = '',
        public metadata: any = null
    ) {
        super();
    }

    toPresentationModel(): ItemDetailPresentationModel {
        return new ItemDetailPresentationModel(
            this.id,
            this.title,
            this.text,
            this.imageUrl,
            this.metadata
        );
    }
}
