
import 'reflect-metadata';
import { GetListItemsUseCase, GetListItemsArgs } from '../GetListItemsUseCase';
import { ListItem } from '../../entities/ListItem';
import { ListItemPresentationModel } from '../../../presentation/models/ListItemPresentationModel';
import { Result } from '../../../core/Result';
import { IItemRepository } from '../../repositories/IItemRepository';

const mockItemRepository: jest.Mocked<IItemRepository> = {
    getItems: jest.fn(),
    getItemDetail: jest.fn(),
    refreshItems: jest.fn(),
};

describe('GetListItemsUseCase', () => {
    let useCase: GetListItemsUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new GetListItemsUseCase(mockItemRepository);
    });

    it('should retrieve items successfully', async () => {
        const mockItems = [
            new ListItem('1', 'Test Item 1', 'Sub', 'Icon', 10),
            new ListItem('2', 'Test Item 2', 'Sub', 'Icon', 20),
        ];

        const expectedItems = mockItems.map(item => item.toPresentationModel());

        mockItemRepository.getItems.mockResolvedValue(Result.success(mockItems));

        const args = new GetListItemsArgs(0, 20);
        const result = await useCase.execute(args);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toEqual(expectedItems);
        expect(result.getValue()).toHaveLength(2);
    });

    it('should call repository with correct arguments', async () => {
        const mockItems: ListItem[] = [];
        mockItemRepository.getItems.mockResolvedValue(Result.success(mockItems));

        const args = new GetListItemsArgs(0, 20);
        await useCase.execute(args);

        expect(mockItemRepository.getItems).toHaveBeenCalledWith(0, 20);
    });

    it('should return failure for negative page number', async () => {
        const args = new GetListItemsArgs(-1, 20);
        const result = await useCase.execute(args);
        expect(result.isFailure).toBe(true);
        expect(result.error!.message).toBe('Page number cannot be negative');
    });

    it('should not call repository when page number is negative', async () => {
        const args = new GetListItemsArgs(-1, 20);
        await useCase.execute(args);
        expect(mockItemRepository.getItems).not.toHaveBeenCalled();
    });

    it('should return failure for invalid page size', async () => {
        const args1 = new GetListItemsArgs(0, 0);
        let result = await useCase.execute(args1);
        expect(result.isFailure).toBe(true);
        expect(result.error!.message).toBe('Page size must be between 1 and 100');

        const args2 = new GetListItemsArgs(0, 101);
        result = await useCase.execute(args2);
        expect(result.isFailure).toBe(true);
        expect(result.error!.message).toBe('Page size must be between 1 and 100');
    });

    it('should not call repository when page size is invalid', async () => {
        const args1 = new GetListItemsArgs(0, 0);
        await useCase.execute(args1);

        const args2 = new GetListItemsArgs(0, 101);
        await useCase.execute(args2);

        expect(mockItemRepository.getItems).not.toHaveBeenCalled();
    });

    it('should filter out invalid items', async () => {
        const validItem = new ListItem('1', 'Valid', 'Sub', 'Icon', 10);
        const invalidItem = new ListItem(null as any, 'Invalid', 'Sub', 'Icon', 10);

        mockItemRepository.getItems.mockResolvedValue(Result.success([validItem, invalidItem]));

        const args = new GetListItemsArgs(0, 20);
        const result = await useCase.execute(args);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toHaveLength(1);
        expect(result.getValue()[0]).toEqual(validItem.toPresentationModel());
    });
});
