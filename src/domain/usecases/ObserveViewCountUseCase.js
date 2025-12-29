
export class ObserveViewCountUseCase {

    constructor(repository) {
        this.repository = repository;
    }

    execute(id) {
        return this.repository.observeViewCount(id);
    }
}
