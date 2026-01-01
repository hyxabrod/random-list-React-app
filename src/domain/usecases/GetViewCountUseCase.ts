import { UseCasePromiseWithArgs, UseCaseWithArgs } from '../../core/UseCase';
import { Result } from '../../core/Result';
import { IViewCountRepository } from '../repositories/IViewCountRepository';
import { ViewCountPresentationModel } from '../../presentation/models/ViewCountPresentationModel';

export class GetViewCountArgs extends UseCasePromiseWithArgs.Args {
    constructor(public id: string) {
        super();
    }
}

export class GetViewCountUseCase extends UseCaseWithArgs<GetViewCountArgs, ViewCountPresentationModel> {
    static Args = GetViewCountArgs;

    constructor(private repository: IViewCountRepository) {
        super();
    }

    perform(args: GetViewCountArgs): Result<ViewCountPresentationModel> {
        try {
            const count = this.repository.getViewCount(args.id);
            return Result.success(new ViewCountPresentationModel(count));
        } catch (error: any) {
            return Result.failure(error);
        }
    }
}
