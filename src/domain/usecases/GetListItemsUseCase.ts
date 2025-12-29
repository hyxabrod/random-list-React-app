
import { UseCaseWithArgs } from '../../core/UseCase';
import { Result } from '../../core/Result';
import { ListItemPresentationModel } from '../../presentation/models/ListItemPresentationModel';
import { IItemRepository } from '../repositories/IItemRepository';

export class GetListItemsArgs extends UseCaseWithArgs.Args {
    constructor(public page: number = 0, public pageSize: number = 20) {
        super();
    }
}

export class GetListItemsUseCase extends UseCaseWithArgs<GetListItemsArgs, ListItemPresentationModel[]> {
    static Args = GetListItemsArgs;

    constructor(private itemRepository: IItemRepository) {
        super();
    }

    async perform(args: GetListItemsArgs): Promise<Result<ListItemPresentationModel[]>> {
        try {
            const { page, pageSize } = args;

            if (page < 0) {
                return Result.failure(new Error('Page number cannot be negative'));
            }

            if (pageSize <= 0 || pageSize > 100) {
                return Result.failure(new Error('Page size must be between 1 and 100'));
            }

            const result = await this.itemRepository.getItems(page, pageSize);

            if (result.isFailure) {
                return Result.failure(result.error!);
            }

            const items = result.getValue();
            const validItems = items
                .filter(item => item.id && item.title)
                .map(item => item.toPresentationModel());

            return Result.success(validItems);
        } catch (error: any) {
            return Result.failure(error);
        }
    }
}
