
import { Observable, Subscriber } from 'rxjs';
import { IViewCountRepository } from '../../domain/repositories/IViewCountRepository';

export class ViewCountRepositoryImpl implements IViewCountRepository {

    observeViewCount(id: string): Observable<number> {
        return new Observable((subscriber: Subscriber<number>) => {

            let currentCount = Math.floor(100 + Math.random() * 900);

            subscriber.next(currentCount);

            const intervalId = setInterval(() => {

                const increment = Math.floor(1 + Math.random() * 5);
                currentCount += increment;

                subscriber.next(currentCount);
            }, 2000);

            return () => {
                clearInterval(intervalId);
            };
        });
    }
}
