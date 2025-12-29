
import { PresentationModel } from '../../core/PresentationModel';

export class ListItemPresentationModel extends PresentationModel {
    constructor(
        public id: string,
        public title: string,
        public subtitle: string,
        public iconUrl: string,
        public viewCount: number
    ) {
        super();
    }
}
