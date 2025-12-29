
import { DomainModel } from '../../core/DomainModel';
import { ListItemPresentationModel } from '../../presentation/models/ListItemPresentationModel';

export class ListItem extends DomainModel {
    constructor(
        public id: string,
        public title: string,
        public subtitle: string = '',
        public iconUrl: string = '',
        public viewCount: number = 0
    ) {
        super();
    }

    toPresentationModel(): ListItemPresentationModel {
        return new ListItemPresentationModel(
            this.id,
            this.title,
            this.subtitle,
            this.iconUrl,
            this.viewCount
        );
    }
}
