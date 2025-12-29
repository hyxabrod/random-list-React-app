
import { UseCaseWithArgs } from '../../core/UseCase';
import { Result } from '../../core/Result';
import { ItemDetailPresentationModel } from '../../presentation/models/ItemDetailPresentationModel';
import { IItemRepository } from '../repositories/IItemRepository';

export class GetItemDetailArgs extends UseCaseWithArgs.Args {
    constructor(public id: string) {
        super();
    }
}

export class GetItemDetailUseCase extends UseCaseWithArgs<GetItemDetailArgs, ItemDetailPresentationModel> {
    static Args = GetItemDetailArgs;

    constructor(private itemRepository: IItemRepository) {
        super();
    }

    async perform(args: GetItemDetailArgs): Promise<Result<ItemDetailPresentationModel>> {
        try {
            const { id } = args;

            if (!id || id.trim().length === 0) {
                return Result.failure(new Error('Item ID is required'));
            }

            const result = await this.itemRepository.getItemDetail(id);

            if (result.isFailure) {
                return Result.failure(result.error!);
            }

            const detail = result.getValue();

            if (!detail.id || !detail.title || !detail.text) {
                return Result.failure(new Error('Invalid item detail received'));
            }



            return Result.success(detail.toPresentationModel());
        } catch (error: any) {
            return Result.failure(error);
        }
    }
}
