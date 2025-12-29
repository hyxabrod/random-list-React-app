
import { PresentationModel } from './PresentationModel';

export abstract class DomainModel {
    abstract toPresentationModel(): PresentationModel;
}
