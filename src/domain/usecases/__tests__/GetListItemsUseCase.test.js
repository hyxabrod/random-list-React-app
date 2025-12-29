
import 'reflect-metadata';
import { GetListItemsUseCase } from '../GetListItemsUseCase';
import { ListItem } from '../../entities/ListItem';
import { Result } from '../../../core/Result';

const mockItemRepository = {
    getItems: jest.fn(),
};

describe('GetListItemsUseCase', () => {
    let useCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new GetListItemsUseCase(mockItemRepository);
    });

    it('should retrieve items successfully', async () => {
        const mockItems = [
            new ListItem('1', 'Test Item 1', 'Sub', 'Icon', 10),
            new ListItem('2', 'Test Item 2', 'Sub', 'Icon', 20),
        ];

        mockItemRepository.getItems.mockResolvedValue(mockItems);

        const args = new GetListItemsUseCase.Args({ page: 0, pageSize: 20 });
        const result = await useCase.execute(args);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toEqual(mockItems);
        expect(result.getValue()).toHaveLength(2);
    });

    it('should call repository with correct arguments', async () => {
        const mockItems = [];
        mockItemRepository.getItems.mockResolvedValue(mockItems);

        const args = new GetListItemsUseCase.Args({ page: 0, pageSize: 20 });
        await useCase.execute(args);

        expect(mockItemRepository.getItems).toHaveBeenCalledWith(0, 20);
    });

    it('should return failure for negative page number', async () => {
        const args = new GetListItemsUseCase.Args({ page: -1, pageSize: 20 });
        const result = await useCase.execute(args);
        expect(result.isFailure).toBe(true);
        expect(result.error.message).toBe('Page number cannot be negative');
        expect(mockItemRepository.getItems).not.toHaveBeenCalled();
    });

    it('should return failure for invalid page size', async () => {
        const args1 = new GetListItemsUseCase.Args({ page: 0, pageSize: 0 });
        let result = await useCase.execute(args1);
        expect(result.isFailure).toBe(true);
        expect(result.error.message).toBe('Page size must be between 1 and 100');

        const args2 = new GetListItemsUseCase.Args({ page: 0, pageSize: 101 });
        result = await useCase.execute(args2);
        expect(result.isFailure).toBe(true);
        expect(result.error.message).toBe('Page size must be between 1 and 100');

        expect(mockItemRepository.getItems).not.toHaveBeenCalled();
    });

    it('should filter out invalid items', async () => {
        const validItem = new ListItem('1', 'Valid', 'Sub', 'Icon', 10);
        const invalidItem = new ListItem(null, 'Invalid', 'Sub', 'Icon', 10);

        mockItemRepository.getItems.mockResolvedValue([validItem, invalidItem]);

        const args = new GetListItemsUseCase.Args({ page: 0, pageSize: 20 });
        const result = await useCase.execute(args);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toHaveLength(1);
        expect(result.getValue()[0]).toEqual(validItem);
    });
});
