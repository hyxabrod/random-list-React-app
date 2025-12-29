
export class UseCase {
    // Base class for identification if needed
}

export class UseCaseNoArgs extends UseCase {
    async execute() {
        throw new Error('Method "execute()" must be implemented.');
    }
}

export class UseCaseWithArgs extends UseCase {
    static Args = class { }

    async execute(args) {
        if (!args || !(args instanceof UseCaseWithArgs.Args)) {
            throw new Error(`Arguments must be an instance of UseCaseWithArgs.Args. Received: ${args}`);
        }
        return this.perform(args);
    }

    async perform(args) {
        throw new Error('Method "perform(args)" must be implemented by subclass.');
    }
}
