
import 'reflect-metadata';
import { GetItemDetailUseCase, GetItemDetailArgs } from '../GetItemDetailUseCase';
import { ItemDetail } from '../../entities/ItemDetail';
import { ItemDetailPresentationModel } from '../../../presentation/models/ItemDetailPresentationModel';
import { Result } from '../../../core/Result';
import { IItemRepository } from '../../repositories/IItemRepository';

const mockItemRepository: jest.Mocked<IItemRepository> = {
    getItems: jest.fn(),
    getItemDetail: jest.fn(),
    refreshItems: jest.fn(),
};

describe('GetItemDetailUseCase', () => {
    let useCase: GetItemDetailUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new GetItemDetailUseCase(mockItemRepository);
    });

    it('should retrieve item detail successfully', async () => {
        const mockDetail = new ItemDetail('1', 'Title', 'Desc.', 'Image');
        mockItemRepository.getItemDetail.mockResolvedValue(Result.success(mockDetail));

        const args = new GetItemDetailArgs('1');
        const result = await useCase.execute(args);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBeInstanceOf(ItemDetailPresentationModel);
        expect(result.getValue().id).toBe(mockDetail.id);
    });

    it('should call repository with correct arguments', async () => {
        const mockDetail = new ItemDetail('1', 'Title', 'Desc', 'Image');
        mockItemRepository.getItemDetail.mockResolvedValue(Result.success(mockDetail));

        const args = new GetItemDetailArgs('1');
        await useCase.execute(args);

        expect(mockItemRepository.getItemDetail).toHaveBeenCalledWith('1');
    });

    it('should return failure if ID is missing', async () => {
        let args = new GetItemDetailArgs(null as any);
        let result = await useCase.execute(args);
        expect(result.isFailure).toBe(true);
        expect(result.error!.message).toBe('Item ID is required');

        args = new GetItemDetailArgs('');
        result = await useCase.execute(args);
        expect(result.isFailure).toBe(true);

        args = new GetItemDetailArgs('   ');
        result = await useCase.execute(args);
        expect(result.isFailure).toBe(true);
    });

    it('should not call repository when ID is missing', async () => {
        let args = new GetItemDetailArgs(null as any);
        await useCase.execute(args);

        args = new GetItemDetailArgs('');
        await useCase.execute(args);

        args = new GetItemDetailArgs('   ');
        await useCase.execute(args);

        expect(mockItemRepository.getItemDetail).not.toHaveBeenCalled();
    });

    it('should return failure if item is invalid', async () => {
        const invalidDetail = new ItemDetail('1', '', '', '');

        mockItemRepository.getItemDetail.mockResolvedValue(Result.success(invalidDetail));

        const args = new GetItemDetailArgs('1');
        const result = await useCase.execute(args);

        expect(result.isFailure).toBe(true);
        expect(result.error!.message).toBe('Invalid item detail received');
    });
});
