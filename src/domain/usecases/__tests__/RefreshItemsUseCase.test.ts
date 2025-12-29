
import 'reflect-metadata';
import { RefreshItemsUseCase } from '../RefreshItemsUseCase';
import { Result } from '../../../core/Result';
import { IItemRepository } from '../../repositories/IItemRepository';

const mockItemRepository: jest.Mocked<IItemRepository> = {
    getItems: jest.fn(),
    getItemDetail: jest.fn(),
    refreshItems: jest.fn(),
};

describe('RefreshItemsUseCase', () => {
    let useCase: RefreshItemsUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new RefreshItemsUseCase(mockItemRepository);
    });

    it('should return success result', async () => {
        // Mock success Result
        mockItemRepository.refreshItems.mockResolvedValue(Result.success(undefined));

        const result = await useCase.execute();
        expect(result.isSuccess).toBe(true);
    });

    it('should call repository method', async () => {
        mockItemRepository.refreshItems.mockResolvedValue(Result.success(undefined));

        await useCase.execute();
        expect(mockItemRepository.refreshItems).toHaveBeenCalled();
    });

    it('should return failure if repository fails with error', async () => {
        // Mock Throw
        mockItemRepository.refreshItems.mockRejectedValue(new Error('Repo error'));

        const result = await useCase.execute();

        expect(result.isFailure).toBe(true);
        expect(result.error!.message).toBe('Repo error');
    });

    it('should return failure if repository returns failure result', async () => {
        mockItemRepository.refreshItems.mockResolvedValue(Result.failure(new Error('Repo failure')));

        const result = await useCase.execute();

        expect(result.isFailure).toBe(true);
        expect(result.error!.message).toBe('Repo failure');
    });
});
