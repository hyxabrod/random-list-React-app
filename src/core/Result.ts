
export class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean;
    public error: Error | null;
    private _value: T | null;

    constructor(isSuccess: boolean, error: Error | null, value: T | null) {
        if (isSuccess && error) {
            throw new Error("InvalidOperation: A result cannot be successful and contain an error");
        }
        if (!isSuccess && !error) {
            throw new Error("InvalidOperation: A failing result needs to contain an error");
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error;
        this._value = value;

        Object.freeze(this);
    }

    getValue(): T {
        if (!this.isSuccess) {
            throw new Error("Can't get the value of an error result. Use 'error' property.");
        }
        return this._value as T;
    }

    static success<U>(value: U): Result<U> {
        return new Result<U>(true, null, value);
    }

    static failure<U>(error: Error): Result<U> {
        return new Result<U>(false, error, null);
    }
}
