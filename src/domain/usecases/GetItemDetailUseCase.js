
import { UseCaseWithArgs } from '../../core/UseCase';
import { Result } from '../../core/Result';

export class GetItemDetailUseCase extends UseCaseWithArgs {

    static Args = class extends UseCaseWithArgs.Args {
        constructor(id) {
            super();
            this.id = id;
        }
    }

    constructor(itemRepository) {
        super();
        this.itemRepository = itemRepository;
    }

    async perform(args) {
        try {
            const { id } = args;

            if (!id || id.trim().length === 0) {
                return Result.failure(new Error('Item ID is required'));
            }

            const detail = await this.itemRepository.getItemDetail(id);

            if (!detail.isValid()) {
                return Result.failure(new Error('Invalid item detail received'));
            }

            if (!detail.metadata || !detail.metadata.sentencesCount) {
                detail.calculateMetadata();
            }

            return Result.success(detail);
        } catch (error) {
            return Result.failure(error);
        }
    }
}
