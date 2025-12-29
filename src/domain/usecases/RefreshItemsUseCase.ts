
import { UseCaseNoArgs } from '../../core/UseCase';
import { Result } from '../../core/Result';
import { IItemRepository } from '../repositories/IItemRepository';
import { ActionPresentationModel } from '../../presentation/models/ActionPresentationModel';

export class RefreshItemsUseCase extends UseCaseNoArgs<ActionPresentationModel> {

    constructor(private itemRepository: IItemRepository) {
        super();
    }

    async execute(): Promise<Result<ActionPresentationModel>> {
        try {
            const result = await this.itemRepository.refreshItems();
            if (result.isSuccess) {
                return Result.success(new ActionPresentationModel());
            }
            return Result.failure(result.error || new Error('Unknown error during refresh'));
        } catch (error: any) {
            return Result.failure(error);
        }
    }
}
