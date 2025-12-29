
import { Observable } from 'rxjs';

export interface IViewCountRepository {
    observeViewCount(id: string): Observable<number>;
}
