
import 'reflect-metadata';
import { ObserveViewCountUseCase } from '../ObserveViewCountUseCase';
import { of } from 'rxjs';

const mockRepository = {
    observeViewCount: jest.fn(),
};

describe('ObserveViewCountUseCase', () => {
    let useCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new ObserveViewCountUseCase(mockRepository);
    });

    it('should return observable from repository', () => {

        const mockObservable = of(42);
        mockRepository.observeViewCount.mockReturnValue(mockObservable);

        const result = useCase.execute('123');

        expect(result).toBe(mockObservable);
    });

    it('should call repository with correct args', () => {
        const mockObservable = of(42);
        mockRepository.observeViewCount.mockReturnValue(mockObservable);

        useCase.execute('123');

        expect(mockRepository.observeViewCount).toHaveBeenCalledWith('123');
    });
});
