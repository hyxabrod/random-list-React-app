
import { DomainModel } from './DomainModel';

export abstract class DataModel {
    abstract toDomainModel(): DomainModel;
}
