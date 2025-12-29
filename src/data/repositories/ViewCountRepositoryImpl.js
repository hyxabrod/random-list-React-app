import { Observable } from 'rxjs';
import { IViewCountRepository } from '../../domain/repositories/IViewCountRepository';

export class ViewCountRepositoryImpl extends IViewCountRepository {

    observeViewCount(id) {
        return new Observable(subscriber => {

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
