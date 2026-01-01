import { Result } from './Result';
import { Observable } from 'rxjs';
import { PresentationModel } from './PresentationModel';

export class UseCase {
}

export type UseCaseResult = PresentationModel | PresentationModel[];

export abstract class UseCaseNoArgs<TResult extends UseCaseResult> extends UseCase {
    abstract execute(): Promise<Result<TResult>>;
}

class UseCaseArgs {
    constructor(...args: any[]) { }
}

export abstract class UseCaseWithArgs<TArgs extends UseCaseArgs, TResult extends UseCaseResult> extends UseCase {
    static Args = UseCaseArgs;

    execute(args: TArgs): Result<TResult> {
        if (!args || !(args instanceof UseCaseArgs)) {
            throw new Error(`Arguments must be an instance of UseCaseArgs. Received: ${args}`);
        }
        return this.perform(args);
    }

    abstract perform(args: TArgs): Result<TResult>;
}

export abstract class UseCasePromiseWithArgs<TArgs extends UseCaseArgs, TResult extends UseCaseResult> extends UseCase {
    static Args = UseCaseArgs;

    async execute(args: TArgs): Promise<Result<TResult>> {
        if (!args || !(args instanceof UseCaseArgs)) {
            throw new Error(`Arguments must be an instance of UseCaseArgs. Received: ${args}`);
        }
        return this.perform(args);
    }

    abstract perform(args: TArgs): Promise<Result<TResult>>;
}

export abstract class UseCaseStream<TArgs extends UseCaseArgs, TResult extends UseCaseResult> extends UseCase {
    static Args = UseCaseArgs;

    execute(args: TArgs): Observable<TResult> {
        if (!args || !(args instanceof UseCaseArgs)) {
            throw new Error(`Arguments must be an instance of UseCaseArgs. Received: ${args}`);
        }
        return this.perform(args);
    }

    abstract perform(args: TArgs): Observable<TResult>;
}
