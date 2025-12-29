
import 'reflect-metadata';
import { RefreshItemsUseCase } from '../RefreshItemsUseCase';
import { Result } from '../../../core/Result';

const mockItemRepository = {
    refreshItems: jest.fn(),
};

describe('RefreshItemsUseCase', () => {
    let useCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new RefreshItemsUseCase(mockItemRepository);
    });

    it('should call repository refreshItems and return success', async () => {
        const result = await useCase.execute();

        expect(mockItemRepository.refreshItems).toHaveBeenCalled();
        expect(result.isSuccess).toBe(true);
    });

    it('should return failure if repository fails', async () => {
        mockItemRepository.refreshItems.mockRejectedValue(new Error('Repo error'));

        const result = await useCase.execute();

        expect(result.isFailure).toBe(true);
        expect(result.error.message).toBe('Repo error');
    });
});
