import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    private isLoading$: Observable<boolean> =
        this.isLoadingSubject.asObservable();

    get getIsLoading(): Observable<boolean> {
        return this.isLoading$;
    }

    setLoadingState(isLoading: boolean): void {
        this.isLoadingSubject.next(isLoading);
    }
}
