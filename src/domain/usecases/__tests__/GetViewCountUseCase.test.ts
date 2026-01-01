
import { GetViewCountUseCase } from '../GetViewCountUseCase';
import { IViewCountRepository } from '../../repositories/IViewCountRepository';
import { ViewCountPresentationModel } from '../../../presentation/models/ViewCountPresentationModel';

describe('GetViewCountUseCase', () => {
    let useCase: GetViewCountUseCase;
    let mockRepository: jest.Mocked<IViewCountRepository>;

    beforeEach(() => {
        mockRepository = {
            observeViewCount: jest.fn(),
            getViewCount: jest.fn(),
        } as unknown as jest.Mocked<IViewCountRepository>;

        useCase = new GetViewCountUseCase(mockRepository);
    });

    it('should return initial view count from repository', () => {
        const id = 'test-id';
        const expectedCount = 5;
        mockRepository.getViewCount.mockReturnValue(expectedCount);

        const args = new GetViewCountUseCase.Args(id);
        const result = useCase.execute(args);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBeInstanceOf(ViewCountPresentationModel);
        expect(result.getValue().count).toBe(expectedCount);
    });

    it('should call repository with correct id', () => {
        const id = 'test-id';
        const expectedCount = 5;
        mockRepository.getViewCount.mockReturnValue(expectedCount);

        const args = new GetViewCountUseCase.Args(id);
        useCase.execute(args);

        expect(mockRepository.getViewCount).toHaveBeenCalledWith(id);
    });

    it('should return 0 when repository returns 0', () => {
        const id = 'test-id-0';
        mockRepository.getViewCount.mockReturnValue(0);

        const args = new GetViewCountUseCase.Args(id);
        const result = useCase.execute(args);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue().count).toBe(0);
    });

    it('should handle repository errors gracefully', () => {
        const id = 'error-id';
        const error = new Error('Storage error');
        mockRepository.getViewCount.mockImplementation(() => {
            throw error;
        });

        const args = new GetViewCountUseCase.Args(id);
        const result = useCase.execute(args);

        expect(result.isFailure).toBe(true);
        expect(result.error).toBe(error);
    });
});
