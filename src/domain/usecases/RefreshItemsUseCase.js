
import { UseCaseNoArgs } from '../../core/UseCase';
import { Result } from '../../core/Result';

export class RefreshItemsUseCase extends UseCaseNoArgs {

    constructor(itemRepository) {
        super();
        this.itemRepository = itemRepository;
    }

    async execute() {
        try {
            await this.itemRepository.refreshItems();
            return Result.success();
        } catch (error) {
            return Result.failure(error);
        }
    }
}
