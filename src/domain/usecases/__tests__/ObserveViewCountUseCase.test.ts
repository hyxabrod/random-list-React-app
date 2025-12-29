
import 'reflect-metadata';
import { ObserveViewCountUseCase } from '../ObserveViewCountUseCase';
import { of } from 'rxjs';
import { IViewCountRepository } from '../../repositories/IViewCountRepository';

const mockRepository: jest.Mocked<IViewCountRepository> = {
    observeViewCount: jest.fn(),
};

describe('ObserveViewCountUseCase', () => {
    let useCase: ObserveViewCountUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new ObserveViewCountUseCase(mockRepository);
    });

    it('should return observable from repository', () => {

        const mockObservable = of(42);
        mockRepository.observeViewCount.mockReturnValue(mockObservable);

        const args = new ObserveViewCountUseCase.Args('123');
        const result = useCase.execute(args);

        result.subscribe(model => {
            expect(model.count).toBe(42);
        });
    });

    it('should call repository with correct args', () => {
        const mockObservable = of(42);
        mockRepository.observeViewCount.mockReturnValue(mockObservable);

        const args = new ObserveViewCountUseCase.Args('123');
        useCase.execute(args);

        expect(mockRepository.observeViewCount).toHaveBeenCalledWith('123');
    });
});
