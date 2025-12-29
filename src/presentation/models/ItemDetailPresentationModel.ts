
import { PresentationModel } from '../../core/PresentationModel';

export class ItemDetailPresentationModel extends PresentationModel {
    constructor(
        public id: string,
        public title: string,
        public text: string,
        public imageUrl: string
    ) {
        super();
    }
}
