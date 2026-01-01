
import { Observable, Subscriber } from 'rxjs';
import { IViewCountRepository } from '../../domain/repositories/IViewCountRepository';
import { generateRandomInt } from '../../utils/randomGenerator';

export class ViewCountRepositoryImpl implements IViewCountRepository {

    private storage: Map<string, number> = new Map();

    getViewCount(id: string): number {
        return this.storage.get(id) || 0;
    }

    observeViewCount(id: string): Observable<number> {
        return new Observable((subscriber: Subscriber<number>) => {
            if (this.storage.has(id)) {
                this.startPeriodicUpdates(id, this.storage.get(id)!, subscriber);
            } else {
                subscriber.next(0);

                const timeoutId = setTimeout(() => {
                    const initialCount = generateRandomInt(100, 1000);
                    this.startPeriodicUpdates(id, initialCount, subscriber);
                }, 1000);

                return () => clearTimeout(timeoutId);
            }
        });
    }

    private startPeriodicUpdates(id: string, initialCount: number, subscriber: Subscriber<number>) {
        this.storage.set(id, initialCount);
        subscriber.next(initialCount);

        let currentCount = initialCount;
        const intervalId = setInterval(() => {
            currentCount += generateRandomInt(1, 5);
            this.storage.set(id, currentCount);
            subscriber.next(currentCount);
        }, 4000);

        subscriber.add(() => clearInterval(intervalId));
    }
}
