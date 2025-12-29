
import { UseCaseWithArgs } from '../../core/UseCase';
import { Result } from '../../core/Result';

export class GetListItemsUseCase extends UseCaseWithArgs {

    static Args = class extends UseCaseWithArgs.Args {
        constructor({ page = 0, pageSize = 20 } = {}) {
            super();
            this.page = page;
            this.pageSize = pageSize;
        }
    }

    constructor(itemRepository) {
        super();
        this.itemRepository = itemRepository;
    }

    async perform(args) {
        try {
            const { page, pageSize } = args;

            if (page < 0) {
                return Result.failure(new Error('Page number cannot be negative'));
            }

            if (pageSize <= 0 || pageSize > 100) {
                return Result.failure(new Error('Page size must be between 1 and 100'));
            }

            const items = await this.itemRepository.getItems(page, pageSize);
            const validItems = items.filter(item => item.isValid());
            return Result.success(validItems);
        } catch (error) {
            return Result.failure(error);
        }
    }
}
