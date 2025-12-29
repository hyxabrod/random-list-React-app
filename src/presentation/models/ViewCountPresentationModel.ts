
import { PresentationModel } from '../../core/PresentationModel';

export class ViewCountPresentationModel extends PresentationModel {
    constructor(public count: number) {
        super();
    }
}
