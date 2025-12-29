import { IViewCountRepository } from '../repositories/IViewCountRepository';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UseCaseStream } from '../../core/UseCase';
import { ViewCountPresentationModel } from '../../presentation/models/ViewCountPresentationModel';

export class ObserveViewCountArgs extends UseCaseStream.Args {
    constructor(public id: string) {
        super();
    }
}

export class ObserveViewCountUseCase extends UseCaseStream<ObserveViewCountArgs, ViewCountPresentationModel> {
    static Args = ObserveViewCountArgs;

    constructor(private repository: IViewCountRepository) {
        super();
    }

    perform(args: ObserveViewCountArgs): Observable<ViewCountPresentationModel> {
        return this.repository.observeViewCount(args.id).pipe(
            map(count => new ViewCountPresentationModel(count))
        );
    }
}
