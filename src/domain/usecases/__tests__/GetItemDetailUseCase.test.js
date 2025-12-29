
import 'reflect-metadata';
import { GetItemDetailUseCase } from '../GetItemDetailUseCase';
import { ItemDetail } from '../../entities/ItemDetail';
import { Result } from '../../../core/Result';

const mockItemRepository = {
    getItemDetail: jest.fn(),
};

describe('GetItemDetailUseCase', () => {
    let useCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new GetItemDetailUseCase(mockItemRepository);
    });

    it('should retrieve item detail successfully', async () => {
        const mockDetail = new ItemDetail('1', 'Title', 'Desc', 'Image');
        jest.spyOn(mockDetail, 'isValid').mockReturnValue(true);
        jest.spyOn(mockDetail, 'calculateMetadata').mockImplementation(() => {
            mockDetail.metadata = { sentencesCount: 5 };
        });

        mockItemRepository.getItemDetail.mockResolvedValue(mockDetail);

        const args = new GetItemDetailUseCase.Args('1');
        const result = await useCase.execute(args);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBe(mockDetail);
        expect(mockDetail.calculateMetadata).toHaveBeenCalled();
    });

    it('should call repository with correct arguments', async () => {
        const mockDetail = new ItemDetail('1', 'Title', 'Desc', 'Image');
        jest.spyOn(mockDetail, 'isValid').mockReturnValue(true);
        mockItemRepository.getItemDetail.mockResolvedValue(mockDetail);

        const args = new GetItemDetailUseCase.Args('1');
        await useCase.execute(args);

        expect(mockItemRepository.getItemDetail).toHaveBeenCalledWith('1');
    });

    it('should return failure if ID is missing', async () => {
        let args = new GetItemDetailUseCase.Args(null);
        let result = await useCase.execute(args);
        expect(result.isFailure).toBe(true);
        expect(result.error.message).toBe('Item ID is required');

        args = new GetItemDetailUseCase.Args('');
        result = await useCase.execute(args);
        expect(result.isFailure).toBe(true);

        args = new GetItemDetailUseCase.Args('   ');
        result = await useCase.execute(args);
        expect(result.isFailure).toBe(true);
    });

    it('should return failure if item is invalid', async () => {
        const invalidDetail = new ItemDetail('1', '', '', '');
        jest.spyOn(invalidDetail, 'isValid').mockReturnValue(false);

        mockItemRepository.getItemDetail.mockResolvedValue(invalidDetail);

        const args = new GetItemDetailUseCase.Args('1');
        const result = await useCase.execute(args);
        expect(result.isFailure).toBe(true);
        expect(result.error.message).toBe('Invalid item detail received');
    });
});
